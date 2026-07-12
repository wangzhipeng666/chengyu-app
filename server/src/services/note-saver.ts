import fs from 'fs';
import path from 'path';
import { getDb } from '../db';

const DATA_DIR = path.join(__dirname, '../../client/src/data');

interface DayData {
  id: string;
  label: string;
  date?: string;
  summary?: string;
  groups: any[];
  quizzes: any[];
}

export function saveDayData(dayData: DayData, overwrite = false): { success: boolean; dayId: string } {
  const filePath = path.join(DATA_DIR, `${dayData.id}.json`);

  if (!overwrite && fs.existsSync(filePath)) {
    throw new Error(`${dayData.id}.json 已存在，使用 overwrite=true 覆盖`);
  }

  fs.writeFileSync(filePath, JSON.stringify(dayData, null, 2), 'utf-8');
  return { success: true, dayId: dayData.id };
}

export function seedDayToDb(dayData: DayData): void {
  const db = getDb();

  const insertDay = db.prepare('INSERT OR REPLACE INTO days (id, label, date, summary) VALUES (?, ?, ?, ?)');
  const insertGroup = db.prepare('INSERT OR REPLACE INTO groups (id, day_id, name, summary) VALUES (?, ?, ?, ?)');
  const insertIdiom = db.prepare(`INSERT OR REPLACE INTO idioms (id, group_id, day_id, name, pronunciation, meaning, origin, usage, collocations, structure, examples, synonyms, tip, one_line_summary, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertWord = db.prepare(`INSERT OR REPLACE INTO words (id, group_id, day_id, name, pronunciation, meaning, usage_context, examples, notes, analysis_angles, synonyms, one_line_summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertQuiz = db.prepare(`INSERT OR REPLACE INTO quizzes (id, day_id, group_id, year, region, question, blank_count, options, answer, analysis, tips) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const transaction = db.transaction(() => {
    insertDay.run(dayData.id, dayData.label, dayData.date || null, dayData.summary || null);

    for (const group of dayData.groups) {
      insertGroup.run(group.id, dayData.id, group.name, group.summary || null);

      if (group.idioms) {
        for (const idiom of group.idioms) {
          insertIdiom.run(
            idiom.id,
            group.id,
            dayData.id,
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
          insertWord.run(
            word.id,
            group.id,
            dayData.id,
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

    for (const quiz of dayData.quizzes) {
      insertQuiz.run(
        quiz.id,
        dayData.id,
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
  });

  transaction();
}
