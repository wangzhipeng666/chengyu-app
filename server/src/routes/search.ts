import { Router } from 'express';
import { getDb } from '../db';

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
    idioms = db.prepare(sql).all(...params).map((i: any) => ({
      ...i,
      collocations: JSON.parse(i.collocations || '[]'),
      examples: JSON.parse(i.examples || '[]'),
      synonyms: JSON.parse(i.synonyms || '[]'),
      confusing: JSON.parse(i.confusing || '[]'),
    }));
  }

  if (type !== 'idiom') {
    let sql = `SELECT * FROM words WHERE (name LIKE ? OR meaning LIKE ? OR one_line_summary LIKE ?)`;
    const params: any[] = [pattern, pattern, pattern];
    if (day) {
      sql += ` AND day_id = ?`;
      params.push(day);
    }
    words = db.prepare(sql).all(...params).map((w: any) => ({
      ...w,
      examples: JSON.parse(w.examples || '[]'),
      analysisAngles: JSON.parse(w.analysis_angles || '[]'),
      synonyms: JSON.parse(w.synonyms || '[]'),
      confusing: JSON.parse(w.confusing || '[]'),
    }));
  }

  res.json({ idioms, words });
});

export default router;
