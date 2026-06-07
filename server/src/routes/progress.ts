import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

// GET /api/progress — get all user progress
router.get('/', (_req, res) => {
  const db = getDb();
  const wrongQuestions = db.prepare('SELECT * FROM wrong_questions ORDER BY timestamp DESC').all();
  const favorites = db.prepare('SELECT * FROM favorites ORDER BY timestamp DESC').all();
  const completedQuizzes = db.prepare('SELECT * FROM completed_quizzes').all();
  const dayProgress = db.prepare('SELECT * FROM day_progress').all();

  res.json({ wrongQuestions, favorites, completedQuizzes, dayProgress });
});

// POST /api/progress/wrong-questions — add wrong question
router.post('/wrong-questions', (req, res) => {
  const db = getDb();
  const { compositeId, dayId, quizId, timestamp, selectedAnswer } = req.body;
  db.prepare(`INSERT OR IGNORE INTO wrong_questions (composite_id, day_id, quiz_id, timestamp, selected_answer) VALUES (?, ?, ?, ?, ?)`)
    .run(compositeId, dayId, quizId, timestamp, selectedAnswer);
  res.json({ ok: true });
});

// DELETE /api/progress/wrong-questions/:compositeId
router.delete('/wrong-questions/:compositeId', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM wrong_questions WHERE composite_id = ?').run(req.params.compositeId);
  res.json({ ok: true });
});

// DELETE /api/progress/wrong-questions — clear all
router.delete('/wrong-questions', (_req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM wrong_questions').run();
  res.json({ ok: true });
});

// POST /api/progress/favorites — add favorite
router.post('/favorites', (req, res) => {
  const db = getDb();
  const { compositeId, dayId, itemId, itemType, timestamp } = req.body;
  db.prepare(`INSERT OR IGNORE INTO favorites (composite_id, day_id, item_id, item_type, timestamp) VALUES (?, ?, ?, ?, ?)`)
    .run(compositeId, dayId, itemId, itemType, timestamp);
  res.json({ ok: true });
});

// DELETE /api/progress/favorites/:compositeId
router.delete('/favorites/:compositeId', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM favorites WHERE composite_id = ?').run(req.params.compositeId);
  res.json({ ok: true });
});

// POST /api/progress/completed-quizzes — mark quiz completed
router.post('/completed-quizzes', (req, res) => {
  const db = getDb();
  const { compositeId, dayId, quizId } = req.body;
  db.prepare(`INSERT OR IGNORE INTO completed_quizzes (composite_id, day_id, quiz_id) VALUES (?, ?, ?)`)
    .run(compositeId, dayId, quizId);
  res.json({ ok: true });
});

// DELETE /api/progress/completed-quizzes — clear all
router.delete('/completed-quizzes', (_req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM completed_quizzes').run();
  res.json({ ok: true });
});

// POST /api/progress/day-progress/:dayId — update day progress
router.post('/day-progress/:dayId', (req, res) => {
  const db = getDb();
  const { dayId } = req.params;
  const { learned, reviewed } = req.body;
  db.prepare(`INSERT INTO day_progress (day_id, learned, reviewed) VALUES (?, ?, ?)
    ON CONFLICT(day_id) DO UPDATE SET learned = MAX(learned, excluded.learned), reviewed = MAX(reviewed, excluded.reviewed)`)
    .run(dayId, learned ? 1 : 0, reviewed ? 1 : 0);
  res.json({ ok: true });
});

export default router;
