import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../data/chengyu.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = DELETE');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    -- 学习内容表
    CREATE TABLE IF NOT EXISTS days (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      date TEXT,
      summary TEXT
    );

    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      day_id TEXT NOT NULL,
      name TEXT NOT NULL,
      summary TEXT,
      FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS idioms (
      id TEXT NOT NULL,
      group_id TEXT NOT NULL,
      day_id TEXT NOT NULL,
      name TEXT NOT NULL,
      pronunciation TEXT,
      meaning TEXT NOT NULL,
      origin TEXT,
      usage TEXT,
      collocations TEXT,       -- JSON array
      structure TEXT,
      examples TEXT,           -- JSON array
      synonyms TEXT,           -- JSON array
      tip TEXT,
      one_line_summary TEXT,
      source TEXT,
      PRIMARY KEY (id, day_id),
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
      FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS words (
      id TEXT NOT NULL,
      group_id TEXT NOT NULL,
      day_id TEXT NOT NULL,
      name TEXT NOT NULL,
      pronunciation TEXT,
      meaning TEXT NOT NULL,
      usage_context TEXT,
      examples TEXT,           -- JSON array of {text, source}
      notes TEXT,
      analysis_angles TEXT,    -- JSON array of {dimension, description}
      synonyms TEXT,           -- JSON array
      one_line_summary TEXT,
      PRIMARY KEY (id, day_id),
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
      FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER,
      day_id TEXT NOT NULL,
      group_id TEXT,
      year TEXT,
      region TEXT,
      question TEXT NOT NULL,
      blank_count INTEGER DEFAULT 1,
      options TEXT NOT NULL,   -- JSON array of {label, text}
      answer TEXT NOT NULL,
      analysis TEXT,           -- JSON object
      tips TEXT,               -- JSON array
      PRIMARY KEY (id, day_id),
      FOREIGN KEY (day_id) REFERENCES days(id) ON DELETE CASCADE,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
    );

    -- 用户进度表
    CREATE TABLE IF NOT EXISTS wrong_questions (
      composite_id TEXT PRIMARY KEY,
      day_id TEXT NOT NULL,
      quiz_id INTEGER NOT NULL,
      timestamp INTEGER NOT NULL,
      selected_answer TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
      composite_id TEXT PRIMARY KEY,
      day_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      item_type TEXT NOT NULL,  -- 'idiom' or 'word'
      timestamp INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS completed_quizzes (
      composite_id TEXT PRIMARY KEY,
      day_id TEXT NOT NULL,
      quiz_id INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS day_progress (
      day_id TEXT PRIMARY KEY,
      learned INTEGER DEFAULT 0,
      reviewed INTEGER DEFAULT 0
    );
  `);
}

export function closeDb() {
  if (db) {
    db.close();
  }
}
