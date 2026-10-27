import express from 'express';
import cors from 'cors';
import path from 'path';
import { getDb } from './db';
import { seedMissingDays } from './seed';
import daysRouter from './routes/days';
import searchRouter from './routes/search';
import progressRouter from './routes/progress';
import notesRouter from './routes/notes';

const app = express();
const PORT = process.env.PORT || 4917;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Initialize database
getDb();
// 全新环境下自动从 client/src/data 补种缺失天，保证拉取代码后启动即有数据
seedMissingDays();

// API routes
app.use('/api/days', daysRouter);
app.use('/api/search', searchRouter);
app.use('/api/progress', progressRouter);
app.use('/api/notes', notesRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Catch-all: serve index.html for client-side routing
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
