import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- 复合键工具 ---
export function quizKey(dayId: string, quizId: number): string {
  return `${dayId}:${quizId}`;
}

export function itemKey(dayId: string, itemId: string): string {
  return `${dayId}:${itemId}`;
}

// --- 类型定义 ---
export interface WrongQuestion {
  compositeId: string;     // "day-1:3"
  dayId: string;
  quizId: number;
  timestamp: number;
  selectedAnswer: string;
}

export interface Favorite {
  compositeId: string;     // "day-1:xinhuoxiangchuan"
  dayId: string;
  itemId: string;
  itemType: 'idiom' | 'word';
  timestamp: number;
}

export interface StudyRecord {
  date: string;
  count: number;
}

export interface DayProgress {
  learned: boolean;
  reviewed: boolean;
}

interface AppState {
  wrongQuestions: WrongQuestion[];
  favorites: Favorite[];
  studyRecords: StudyRecord[];
  completedQuizzes: string[];   // composite keys like "day-1:3"
  dayProgress: Record<string, DayProgress>;
  todayCorrect: number;
  todayTotal: number;
  streak: number;
  lastStudyDate: string | null;

  addWrongQuestion: (dayId: string, quizId: number, selectedAnswer: string) => void;
  removeWrongQuestion: (dayId: string, quizId: number) => void;
  clearWrongQuestions: () => void;
  addFavorite: (dayId: string, itemId: string, itemType: 'idiom' | 'word') => void;
  removeFavorite: (dayId: string, itemId: string) => void;
  isFavorite: (dayId: string, itemId: string) => boolean;
  recordAnswer: (correct: boolean) => void;
  markQuizCompleted: (dayId: string, quizId: number) => void;
  isQuizCompleted: (dayId: string, quizId: number) => boolean;
  markDayLearned: (dayId: string) => void;
  markDayReviewed: (dayId: string) => void;
  getDayProgress: (dayId: string) => DayProgress;
  resetToday: () => void;
  resetCompleted: () => void;
}

const getToday = () => new Date().toISOString().split('T')[0];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      wrongQuestions: [],
      favorites: [],
      studyRecords: [],
      completedQuizzes: [],
      dayProgress: {},
      todayCorrect: 0,
      todayTotal: 0,
      streak: 0,
      lastStudyDate: null,

      addWrongQuestion: (dayId, quizId, selectedAnswer) => {
        const cid = quizKey(dayId, quizId);
        const existing = get().wrongQuestions.find(w => w.compositeId === cid);
        if (!existing) {
          set(state => ({
            wrongQuestions: [...state.wrongQuestions, {
              compositeId: cid,
              dayId,
              quizId,
              timestamp: Date.now(),
              selectedAnswer,
            }],
          }));
        }
      },

      removeWrongQuestion: (dayId, quizId) => {
        const cid = quizKey(dayId, quizId);
        set(state => ({
          wrongQuestions: state.wrongQuestions.filter(w => w.compositeId !== cid),
        }));
      },

      clearWrongQuestions: () => set({ wrongQuestions: [] }),

      addFavorite: (dayId, itemId, itemType) => {
        const cid = itemKey(dayId, itemId);
        const existing = get().favorites.find(f => f.compositeId === cid);
        if (!existing) {
          set(state => ({
            favorites: [...state.favorites, {
              compositeId: cid,
              dayId,
              itemId,
              itemType,
              timestamp: Date.now(),
            }],
          }));
        }
      },

      removeFavorite: (dayId, itemId) => {
        const cid = itemKey(dayId, itemId);
        set(state => ({
          favorites: state.favorites.filter(f => f.compositeId !== cid),
        }));
      },

      isFavorite: (dayId, itemId) => {
        const cid = itemKey(dayId, itemId);
        return get().favorites.some(f => f.compositeId === cid);
      },

      markQuizCompleted: (dayId, quizId) => {
        const cid = quizKey(dayId, quizId);
        if (!get().completedQuizzes.includes(cid)) {
          set(state => ({
            completedQuizzes: [...state.completedQuizzes, cid],
          }));
        }
      },

      isQuizCompleted: (dayId, quizId) => {
        const cid = quizKey(dayId, quizId);
        return get().completedQuizzes.includes(cid);
      },

      markDayLearned: (dayId) => {
        set(state => ({
          dayProgress: {
            ...state.dayProgress,
            [dayId]: { ...state.dayProgress[dayId], learned: true },
          },
        }));
      },

      markDayReviewed: (dayId) => {
        set(state => ({
          dayProgress: {
            ...state.dayProgress,
            [dayId]: { ...state.dayProgress[dayId], reviewed: true },
          },
        }));
      },

      getDayProgress: (dayId) => {
        return get().dayProgress[dayId] || { learned: false, reviewed: false };
      },

      recordAnswer: (correct) => {
        const today = getToday();
        const lastDate = get().lastStudyDate;
        const isNewDay = lastDate !== today;

        set(state => {
          let newStreak = state.streak;
          if (isNewDay) {
            if (lastDate) {
              const last = new Date(lastDate);
              const now = new Date(today);
              const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
              newStreak = diff === 1 ? state.streak + 1 : 1;
            } else {
              newStreak = 1;
            }
          }

          return {
            todayCorrect: isNewDay ? (correct ? 1 : 0) : state.todayCorrect + (correct ? 1 : 0),
            todayTotal: isNewDay ? 1 : state.todayTotal + 1,
            streak: newStreak,
            lastStudyDate: today,
          };
        });
      },

      resetToday: () => set({ todayCorrect: 0, todayTotal: 0 }),

      resetCompleted: () => set({ completedQuizzes: [] }),
    }),
    {
      name: 'chengyu-storage',
    }
  )
);
