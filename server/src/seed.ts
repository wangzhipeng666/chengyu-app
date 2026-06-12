import fs from 'fs';
import path from 'path';
import { getDb } from './db';

const DATA_DIR = path.join(__dirname, '../../client/src/data');

interface DayJson {
  id: string;
  label: string;
  date?: string;
  summary?: string;
  groups: any[];
  quizzes: any[];
}

function seed() {
  const db = getDb();

  // Clear existing data
  db.exec('DELETE FROM quizzes');
  db.exec('DELETE FROM words');
  db.exec('DELETE FROM idioms');
  db.exec('DELETE FROM groups');
  db.exec('DELETE FROM days');

  const dayFiles = ['day-1.json', 'day-2.json', 'day-3.json', 'day-4.json', 'day-5.json', 'day-6.json'];

  const insertDay = db.prepare('INSERT INTO days (id, label, date, summary) VALUES (?, ?, ?, ?)');
  const insertGroup = db.prepare('INSERT INTO groups (id, day_id, name, summary) VALUES (?, ?, ?, ?)');
  const insertIdiom = db.prepare(`INSERT INTO idioms (id, group_id, day_id, name, pronunciation, meaning, origin, usage, collocations, structure, examples, synonyms, tip, one_line_summary, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertWord = db.prepare(`INSERT INTO words (id, group_id, day_id, name, pronunciation, meaning, usage_context, examples, notes, analysis_angles, synonyms, one_line_summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertQuiz = db.prepare(`INSERT INTO quizzes (id, day_id, group_id, year, region, question, blank_count, options, answer, analysis, tips) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const transaction = db.transaction(() => {
    for (const file of dayFiles) {
      const filePath = path.join(DATA_DIR, file);
      const data: DayJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      console.log(`Seeding ${data.label} (${data.id})...`);

      // Insert day
      insertDay.run(data.id, data.label, data.date || null, data.summary || null);

      // Insert groups and their idioms/words
      for (const group of data.groups) {
        insertGroup.run(group.id, data.id, group.name, group.summary || null);

        // Insert idioms
        if (group.idioms) {
          for (const idiom of group.idioms) {
            insertIdiom.run(
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

        // Insert words
        if (group.words) {
          for (const word of group.words) {
            insertWord.run(
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

      // Insert quizzes
      for (const quiz of data.quizzes) {
        insertQuiz.run(
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

      console.log(`  ${data.groups.length} groups, ${data.quizzes.length} quizzes`);
    }
  });

  transaction();

  // Print summary
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

seed();
