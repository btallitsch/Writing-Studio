// ── Types ────────────────────────────────────────────────────────────────────

export type NavSection =
  | 'dashboard'
  | 'editor'
  | 'ideas'
  | 'story'
  | 'characters'
  | 'streak';

// ── Idea Vault ────────────────────────────────────────────────────────────────

export type IdeaMood = 'spark' | 'dark' | 'hopeful' | 'tense' | 'curious' | 'raw';

export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  mood: IdeaMood;
  createdAt: number;
  updatedAt: number;
  userId: string;
}

// ── Story Structure ───────────────────────────────────────────────────────────

export type StoryBeat =
  | 'setup'
  | 'inciting'
  | 'rising'
  | 'midpoint'
  | 'climax'
  | 'resolution';

export interface StoryCard {
  id: string;
  title: string;
  description: string;
  beat: StoryBeat;
  order: number;
  createdAt: number;
  userId: string;
}

// ── Character Database ────────────────────────────────────────────────────────

export type CharacterRole = 'protagonist' | 'antagonist' | 'supporting' | 'minor';

export interface Character {
  id: string;
  name: string;
  role: CharacterRole;
  age?: string;
  traits: string[];
  backstory: string;
  motivation: string;
  avatarColor: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
}

// ── Markdown Editor ───────────────────────────────────────────────────────────

export interface Document {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  createdAt: number;
  updatedAt: number;
  userId: string;
}

// ── Writing Streak ────────────────────────────────────────────────────────────

export interface StreakDay {
  date: string; // YYYY-MM-DD
  wordCount: number;
}

export interface StreakData {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  totalWords: number;
  days: StreakDay[];
  lastActiveDate: string;
}
