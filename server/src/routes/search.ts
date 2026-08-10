import { Router } from 'express';
import { getDb } from '../db';
import { parseIdiom, parseWord, type DbRow } from '../serializers';

const router = Router();

// GET /api/search?q=xxx&day=xxx&type=idiom|word
router.get('/', (req, res) => {
  const db = getDb();
  const q = (req.query.q as string || '').trim();
  const day = req.query.day as string;
  const type = req.query.type as string;

  if (!q) {
    res.json({ idioms: [], words: [] });
    return;
  }

  const pattern = `%${q}%`;

  let idioms: any[] = [];
  let words: any[] = [];

  if (type !== 'word') {
    let sql = `SELECT * FROM idioms WHERE (name LIKE ? OR meaning LIKE ? OR one_line_summary LIKE ?)`;
    const params: any[] = [pattern, pattern, pattern];
    if (day) {
      sql += ` AND day_id = ?`;
      params.push(day);
    }
    idioms = (db.prepare(sql).all(...params) as DbRow[]).map(parseIdiom);
  }

  if (type !== 'idiom') {
    let sql = `SELECT * FROM words WHERE (name LIKE ? OR meaning LIKE ? OR one_line_summary LIKE ?)`;
    const params: any[] = [pattern, pattern, pattern];
    if (day) {
      sql += ` AND day_id = ?`;
      params.push(day);
    }
    words = (db.prepare(sql).all(...params) as DbRow[]).map(parseWord);
  }

  res.json({ idioms, words });
});

export default router;
