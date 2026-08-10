import path from 'path';

// __dirname points at server/src in development and server/dist after build.
// Resolve from the server package so both modes use the same project paths.
export const SERVER_DIR = path.resolve(__dirname, '..');
export const PROJECT_DIR = path.resolve(SERVER_DIR, '..');
export const CLIENT_DIR = path.join(PROJECT_DIR, 'client');
export const DAY_DATA_DIR = path.join(CLIENT_DIR, 'src', 'data');
export const PUBLIC_PDF_DIR = path.join(CLIENT_DIR, 'public', 'pdfs');
export const UPLOAD_DIR = path.join(SERVER_DIR, 'uploads');
export const PARSE_PROMPT_PATH = path.join(SERVER_DIR, 'prompts', 'parse-note.md');
