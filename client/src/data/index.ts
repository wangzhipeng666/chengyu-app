import day1 from './day-1.json';
import day2 from './day-2.json';
import day3 from './day-3.json';
import type { DayData, Idiom, Word } from '../types';

// Cast JSON imports to satisfy TypeScript (JSON inference doesn't perfectly match our types)
export const days: DayData[] = [day1 as DayData, day2 as DayData, day3 as DayData];

export function getDay(id: string): DayData | undefined {
  return days.find(d => d.id === id);
}

export function getAllIdioms(): { idiom: Idiom; dayId: string; groupName: string }[] {
  const result: { idiom: Idiom; dayId: string; groupName: string }[] = [];
  for (const day of days) {
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
  for (const day of days) {
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
  for (const day of days) {
    for (const quiz of day.quizzes) {
      result.push({ quiz, dayId: day.id });
    }
  }
  return result;
}
