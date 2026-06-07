import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

// GET /api/days — list all days with summary info
router.get('/', (_req, res) => {
  const db = getDb();
  const days = db.prepare(`
    SELECT d.*,
      (SELECT COUNT(*) FROM idioms WHERE day_id = d.id) as idiom_count,
      (SELECT COUNT(*) FROM words WHERE day_id = d.id) as word_count,
      (SELECT COUNT(*) FROM quizzes WHERE day_id = d.id) as quiz_count
    FROM days d
    ORDER BY d.id
  `).all();
  res.json(days);
});

// GET /api/days/:id — get full day data with groups, idioms, words, quizzes
router.get('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;

  const day = db.prepare('SELECT * FROM days WHERE id = ?').get(id) as any;
  if (!day) {
    res.status(404).json({ error: 'Day not found' });
    return;
  }

  // Get groups
  const groups = db.prepare('SELECT * FROM groups WHERE day_id = ? ORDER BY rowid').all(id) as any[];

  // Get idioms for this day
  const idioms = db.prepare('SELECT * FROM idioms WHERE day_id = ?').all(id) as any[];

  // Get words for this day
  const words = db.prepare('SELECT * FROM words WHERE day_id = ?').all(id) as any[];

  // Get quizzes for this day
  const quizzes = db.prepare('SELECT * FROM quizzes WHERE day_id = ? ORDER BY rowid').all(id) as any[];

  // Parse JSON fields
  const parseIdiom = (i: any) => ({
    ...i,
    collocations: JSON.parse(i.collocations || '[]'),
    examples: JSON.parse(i.examples || '[]'),
    synonyms: JSON.parse(i.synonyms || '[]'),
    confusing: JSON.parse(i.confusing || '[]'),
  });

  const parseWord = (w: any) => ({
    ...w,
    examples: JSON.parse(w.examples || '[]'),
    analysisAngles: JSON.parse(w.analysis_angles || '[]'),
    synonyms: JSON.parse(w.synonyms || '[]'),
    confusing: JSON.parse(w.confusing || '[]'),
  });

  const parseQuiz = (q: any) => ({
    ...q,
    options: JSON.parse(q.options || '[]'),
    analysis: JSON.parse(q.analysis || '{}'),
    tips: JSON.parse(q.tips || '[]'),
  });

  // Attach idioms/words to groups
  const groupsWithContent = groups.map(g => ({
    id: g.id,
    name: g.name,
    summary: g.summary,
    idioms: idioms.filter(i => i.group_id === g.id).map(parseIdiom),
    words: words.filter(w => w.group_id === g.id).map(parseWord),
  }));

  res.json({
    id: day.id,
    label: day.label,
    date: day.date,
    summary: day.summary,
    groups: groupsWithContent,
    quizzes: quizzes.map(parseQuiz),
  });
});

export default router;
