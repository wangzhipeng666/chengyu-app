import type { DayData, Idiom, Word } from './types';

const API_BASE = 'http://localhost:4917/api';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function postJson<T>(url: string, body: any): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function deleteJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// --- Days ---
export async function fetchDays(): Promise<(DayData & { idiom_count: number; word_count: number; quiz_count: number })[]> {
  return fetchJson(`${API_BASE}/days`);
}

export async function fetchDay(id: string): Promise<DayData> {
  return fetchJson(`${API_BASE}/days/${id}`);
}

// --- Search ---
export async function searchItems(q: string, day?: string, type?: string): Promise<{ idioms: Idiom[]; words: Word[] }> {
  const params = new URLSearchParams({ q });
  if (day) params.set('day', day);
  if (type) params.set('type', type);
  return fetchJson(`${API_BASE}/search?${params}`);
}

// --- Progress ---
export interface ProgressData {
  wrongQuestions: { composite_id: string; day_id: string; quiz_id: number; timestamp: number; selected_answer: string }[];
  favorites: { composite_id: string; day_id: string; item_id: string; item_type: string; timestamp: number }[];
  completedQuizzes: { composite_id: string; day_id: string; quiz_id: number }[];
  dayProgress: { day_id: string; learned: number; reviewed: number }[];
}

export async function fetchProgress(): Promise<ProgressData> {
  return fetchJson(`${API_BASE}/progress`);
}

export async function addWrongQuestion(compositeId: string, dayId: string, quizId: number, selectedAnswer: string) {
  return postJson(`${API_BASE}/progress/wrong-questions`, {
    compositeId, dayId, quizId, timestamp: Date.now(), selectedAnswer,
  });
}

export async function removeWrongQuestion(compositeId: string) {
  return deleteJson(`${API_BASE}/progress/wrong-questions/${compositeId}`);
}

export async function clearWrongQuestions() {
  return deleteJson(`${API_BASE}/progress/wrong-questions`);
}

export async function addFavorite(compositeId: string, dayId: string, itemId: string, itemType: string) {
  return postJson(`${API_BASE}/progress/favorites`, {
    compositeId, dayId, itemId, itemType, timestamp: Date.now(),
  });
}

export async function removeFavorite(compositeId: string) {
  return deleteJson(`${API_BASE}/progress/favorites/${compositeId}`);
}

export async function markQuizCompleted(compositeId: string, dayId: string, quizId: number) {
  return postJson(`${API_BASE}/progress/completed-quizzes`, { compositeId, dayId, quizId });
}

export async function clearCompletedQuizzes() {
  return deleteJson(`${API_BASE}/progress/completed-quizzes`);
}

export async function updateDayProgress(dayId: string, learned: boolean, reviewed: boolean) {
  return postJson(`${API_BASE}/progress/day-progress/${dayId}`, { learned, reviewed });
}
