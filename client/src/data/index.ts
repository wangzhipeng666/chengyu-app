import type { DayData, Idiom, Word } from '../types';
import * as api from '../api';

// In-memory cache
let cachedDays: DayData[] | null = null;
let cachedDaysMap: Map<string, DayData> = new Map();

export async function loadDays(): Promise<DayData[]> {
  if (cachedDays) return cachedDays;
  const daysList = await api.fetchDays();
  // Load full data for each day
  const days: DayData[] = [];
  for (const d of daysList) {
    const full = await api.fetchDay(d.id);
    days.push(full);
    cachedDaysMap.set(d.id, full);
  }
  cachedDays = days;
  return days;
}

export function getDaysFromCache(): DayData[] {
  return cachedDays || [];
}

export function getDayFromCache(id: string): DayData | undefined {
  return cachedDaysMap.get(id);
}

export async function getDay(id: string): Promise<DayData | undefined> {
  if (cachedDaysMap.has(id)) return cachedDaysMap.get(id);
  try {
    const day = await api.fetchDay(id);
    cachedDaysMap.set(id, day);
    return day;
  } catch {
    return undefined;
  }
}

export async function searchItems(q: string, day?: string, type?: string) {
  return api.searchItems(q, day, type);
}

// Legacy sync exports (for components that need immediate access)
// These return empty arrays until data is loaded
export function getAllIdioms(): { idiom: Idiom; dayId: string; groupName: string }[] {
  const result: { idiom: Idiom; dayId: string; groupName: string }[] = [];
  for (const day of cachedDays || []) {
    for (const group of day.groups) {
      if (group.idioms) {
        for (const idiom of group.idioms) {
          result.push({ idiom, dayId: day.id, groupName: group.name });
        }
      }
    }
  }
  return result;
}

export function getAllWords(): { word: Word; dayId: string; groupName: string }[] {
  const result: { word: Word; dayId: string; groupName: string }[] = [];
  for (const day of cachedDays || []) {
    for (const group of day.groups) {
      if (group.words) {
        for (const word of group.words) {
          result.push({ word, dayId: day.id, groupName: group.name });
        }
      }
    }
  }
  return result;
}

export function getAllQuizzes() {
  const result: { quiz: DayData['quizzes'][number]; dayId: string }[] = [];
  for (const day of cachedDays || []) {
    for (const quiz of day.quizzes) {
      result.push({ quiz, dayId: day.id });
    }
  }
  return result;
}
