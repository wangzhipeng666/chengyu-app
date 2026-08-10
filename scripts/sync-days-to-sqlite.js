#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const days = process.argv.slice(2).map(Number);

if (!days.length || days.some(day => !Number.isInteger(day) || day < 1)) {
  console.error('Usage: node scripts/sync-days-to-sqlite.js <day-number> [...]');
  process.exit(1);
}

function sql(value) {
  if (value === undefined || value === null) return 'NULL';
  return `'${String(value).replaceAll("'", "''")}'`;
}

const statements = ['PRAGMA foreign_keys = ON;', 'BEGIN IMMEDIATE;'];

for (const day of days) {
  const dataPath = path.join(ROOT, 'client', 'src', 'data', `day-${day}.json`);
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  if (data.id !== `day-${day}` || data.label !== `第${day}天`) {
    throw new Error(`Identity mismatch in ${dataPath}`);
  }

  statements.push(
    `DELETE FROM quizzes WHERE day_id = ${sql(data.id)};`,
    `DELETE FROM words WHERE day_id = ${sql(data.id)};`,
    `DELETE FROM idioms WHERE day_id = ${sql(data.id)};`,
    `DELETE FROM groups WHERE day_id = ${sql(data.id)};`,
    `DELETE FROM days WHERE id = ${sql(data.id)};`,
    `INSERT INTO days (id, label, date, summary) VALUES (${sql(data.id)}, ${sql(data.label)}, ${sql(data.date)}, ${sql(data.summary)});`
  );

  for (const group of data.groups) {
    statements.push(`INSERT INTO groups (id, day_id, name, summary) VALUES (${sql(group.id)}, ${sql(data.id)}, ${sql(group.name)}, ${sql(group.summary)});`);
    for (const idiom of group.idioms || []) {
      statements.push(`INSERT INTO idioms (id, group_id, day_id, name, pronunciation, meaning, origin, usage, collocations, structure, examples, synonyms, tip, one_line_summary, source) VALUES (${[
        idiom.id, group.id, data.id, idiom.name, idiom.pronunciation, idiom.meaning,
        idiom.origin, idiom.usage, JSON.stringify(idiom.collocations || []), idiom.structure,
        JSON.stringify(idiom.examples || []), JSON.stringify(idiom.synonyms || []), idiom.tip,
        idiom.oneLineSummary, idiom.source,
      ].map(sql).join(', ')});`);
    }
    for (const word of group.words || []) {
      statements.push(`INSERT INTO words (id, group_id, day_id, name, pronunciation, meaning, usage_context, examples, notes, analysis_angles, synonyms, one_line_summary) VALUES (${[
        word.id, group.id, data.id, word.name, word.pronunciation, word.meaning,
        word.usageContext, JSON.stringify(word.examples || []), word.notes,
        JSON.stringify(word.analysisAngles || []), JSON.stringify(word.synonyms || []),
        word.oneLineSummary,
      ].map(sql).join(', ')});`);
    }
  }

  for (const quiz of data.quizzes) {
    statements.push(`INSERT INTO quizzes (id, day_id, group_id, year, region, question, blank_count, options, answer, analysis, tips) VALUES (${[
      quiz.id, data.id, quiz.groupId, quiz.year, quiz.region, quiz.question, quiz.blankCount,
      JSON.stringify(quiz.options), quiz.answer, JSON.stringify(quiz.analysis || {}),
      JSON.stringify(quiz.tips || []),
    ].map(sql).join(', ')});`);
  }
}

statements.push('COMMIT;');
const databasePath = path.join(ROOT, 'server', 'data', 'chengyu.db');
const result = spawnSync('sqlite3', [databasePath], {
  input: `${statements.join('\n')}\n`,
  encoding: 'utf8',
});
if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status || 1);
}
console.log(`Synced ${days.map(day => `day-${day}`).join(', ')} to ${databasePath}`);
