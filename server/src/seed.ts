import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { getDb } from './db';
import { DAY_DATA_DIR } from './project-paths';

interface DayJson {
  id: string;
  label: string;
  date?: string;
  summary?: string;
  groups: any[];
  quizzes: any[];
}

function listDayFiles(dataDir: string): string[] {
  return fs.readdirSync(dataDir)
    .filter(file => /^day-\d+\.json$/.test(file))
    .sort((a, b) => Number(a.match(/\d+/)?.[0] || 0) - Number(b.match(/\d+/)?.[0] || 0));
}

function readDay(dataDir: string, file: string): DayJson {
  return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
}

function createStatements(db: Database.Database) {
  return {
    insertDay: db.prepare('INSERT INTO days (id, label, date, summary) VALUES (?, ?, ?, ?)'),
    insertGroup: db.prepare('INSERT INTO groups (id, day_id, name, summary) VALUES (?, ?, ?, ?)'),
    insertIdiom: db.prepare(`INSERT INTO idioms (id, group_id, day_id, name, pronunciation, meaning, origin, usage, collocations, structure, examples, synonyms, tip, one_line_summary, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
    insertWord: db.prepare(`INSERT INTO words (id, group_id, day_id, name, pronunciation, meaning, usage_context, examples, notes, analysis_angles, synonyms, one_line_summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
    insertQuiz: db.prepare(`INSERT INTO quizzes (id, day_id, group_id, year, region, question, blank_count, options, answer, analysis, tips) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`),
  };
}

function seedDay(db: Database.Database, data: DayJson) {
  const stmts = createStatements(db);

  db.transaction(() => {
    stmts.insertDay.run(data.id, data.label, data.date || null, data.summary || null);

    for (const group of data.groups) {
      stmts.insertGroup.run(group.id, data.id, group.name, group.summary || null);

      if (group.idioms) {
        for (const idiom of group.idioms) {
          stmts.insertIdiom.run(
            idiom.id,
            group.id,
            data.id,
            idiom.name,
            idiom.pronunciation || null,
            idiom.meaning,
            idiom.origin || null,
            idiom.usage || null,
            JSON.stringify(idiom.collocations || []),
            idiom.structure || null,
            JSON.stringify(idiom.examples || []),
            JSON.stringify(idiom.synonyms || []),
            idiom.tip || null,
            idiom.oneLineSummary || null,
            idiom.source || null
          );
        }
      }

      if (group.words) {
        for (const word of group.words) {
          stmts.insertWord.run(
            word.id,
            group.id,
            data.id,
            word.name,
            word.pronunciation || null,
            word.meaning,
            word.usageContext || null,
            JSON.stringify(word.examples || []),
            word.notes || null,
            JSON.stringify(word.analysisAngles || []),
            JSON.stringify(word.synonyms || []),
            word.oneLineSummary || null
          );
        }
      }
    }

    for (const quiz of data.quizzes) {
      stmts.insertQuiz.run(
        quiz.id,
        data.id,
        quiz.groupId || null,
        quiz.year || null,
        quiz.region || null,
        quiz.question,
        quiz.blankCount || 1,
        JSON.stringify(quiz.options),
        quiz.answer,
        JSON.stringify(quiz.analysis || {}),
        JSON.stringify(quiz.tips || [])
      );
    }
  })();
}

// 首次启动（或全新数据库）时，把 client/src/data 中 DB 还没有的天补种进去。
// 已存在的天不覆盖，保留用户进度。
export function seedMissingDays(dataDir: string = DAY_DATA_DIR) {
  const db = getDb();
  const exists = db.prepare('SELECT 1 FROM days WHERE id = ?');

  for (const file of listDayFiles(dataDir)) {
    const data = readDay(dataDir, file);
    if (!exists.get(data.id)) {
      console.log(`Seeding missing ${data.label} (${data.id})...`);
      seedDay(db, data);
    }
  }
}

// 全量重建内容数据（保留学习进度表）。npm run seed 使用。
export function seedAll(dataDir: string = DAY_DATA_DIR) {
  const db = getDb();

  db.exec('DELETE FROM quizzes');
  db.exec('DELETE FROM words');
  db.exec('DELETE FROM idioms');
  db.exec('DELETE FROM groups');
  db.exec('DELETE FROM days');

  for (const file of listDayFiles(dataDir)) {
    const data = readDay(dataDir, file);
    console.log(`Seeding ${data.label} (${data.id})...`);
    seedDay(db, data);
  }

  const dayCount = db.prepare('SELECT COUNT(*) as count FROM days').get() as any;
  const groupCount = db.prepare('SELECT COUNT(*) as count FROM groups').get() as any;
  const idiomCount = db.prepare('SELECT COUNT(*) as count FROM idioms').get() as any;
  const wordCount = db.prepare('SELECT COUNT(*) as count FROM words').get() as any;
  const quizCount = db.prepare('SELECT COUNT(*) as count FROM quizzes').get() as any;

  console.log('\nSeed complete!');
  console.log(`  Days: ${dayCount.count}`);
  console.log(`  Groups: ${groupCount.count}`);
  console.log(`  Idioms: ${idiomCount.count}`);
  console.log(`  Words: ${wordCount.count}`);
  console.log(`  Quizzes: ${quizCount.count}`);
}

if (require.main === module) {
  seedAll();
}
