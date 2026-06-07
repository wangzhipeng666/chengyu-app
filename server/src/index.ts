import express from 'express';
import cors from 'cors';
import path from 'path';
import { getDb } from './db';
import daysRouter from './routes/days';
import searchRouter from './routes/search';
import progressRouter from './routes/progress';

const app = express();
const PORT = process.env.PORT || 4917;

app.use(cors());
app.use(express.json());

// Initialize database
getDb();

// API routes
app.use('/api/days', daysRouter);
app.use('/api/search', searchRouter);
app.use('/api/progress', progressRouter);

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
