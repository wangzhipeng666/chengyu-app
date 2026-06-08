// ============================================
// 成语学习助手 - TypeScript 类型定义
// ============================================

// --- 实词类型 ---
export interface WordExample {
  text: string;
  source?: string;
}

export interface AnalysisAngle {
  dimension: string;
  description: string;
}

export interface Word {
  id: string;
  name: string;
  pronunciation?: string;
  meaning: string;
  usageContext: string;
  examples: WordExample[];
  notes?: string;
  analysisAngles: AnalysisAngle[];
  synonyms: string[];
  oneLineSummary: string;
}

// --- 成语类型 ---
export interface Idiom {
  id: string;
  name: string;
  pronunciation?: string;
  meaning: string;
  origin?: string;
  usage: string;
  collocations?: string[];
  structure?: string;
  examples?: string[];
  synonyms?: string[];
  tip?: string;
  oneLineSummary: string;
  source?: string;
}

// --- 题目类型 ---
export interface Quiz {
  id: number;
  year?: string;
  region?: string;
  groupId?: string;
  question: string;
  blankCount: number;
  options: { label: string; text: string }[];
  answer: string;
  analysis: Record<string, string>;
  tips: string[];
}

// --- 天数分组 ---
export interface DayGroup {
  id: string;
  name: string;
  idioms?: Idiom[];
  words?: Word[];
  summary?: string;
}

// --- 天数数据 ---
export interface DayData {
  id: string;
  label: string;
  date?: string;
  summary?: string;
  groups: DayGroup[];
  quizzes: Quiz[];
}

// --- 兼容旧类型（用于 Day 1 的 subgroups 结构）---
export interface IdiomGroup {
  id: string;
  name: string;
  description?: string;
  summary?: string;
  idioms?: Idiom[];
  subgroups?: {
    id: string;
    name: string;
    idioms: Idiom[];
  }[];
}
