import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from client build
app.use(express.static(path.join(__dirname, '../../client/dist')));

// API routes will be added here
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Catch-all: serve index.html for client-side routing
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
