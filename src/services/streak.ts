import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { StreakData, StreakDay } from '../types';
import { todayKey } from '../utils/dates';

function streakRef(userId: string) {
  return doc(db, 'streaks', userId);
}

export function subscribeStreak(
  userId: string,
  cb: (data: StreakData | null) => void
): Unsubscribe {
  return onSnapshot(streakRef(userId), snap => {
    cb(snap.exists() ? (snap.data() as StreakData) : null);
  });
}

export async function recordWords(
  userId: string,
  wordsToday: number
): Promise<void> {
  const ref = streakRef(userId);
  const snap = await getDoc(ref);
  const today = todayKey();

  if (!snap.exists()) {
    const fresh: StreakData = {
      userId,
      currentStreak: 1,
      longestStreak: 1,
      totalWords: wordsToday,
      days: [{ date: today, wordCount: wordsToday }],
      lastActiveDate: today,
    };
    await setDoc(ref, fresh);
    return;
  }

  const data = snap.data() as StreakData;
  const days = [...data.days];
  const existingIdx = days.findIndex(d => d.date === today);

  if (existingIdx >= 0) {
    days[existingIdx] = { date: today, wordCount: wordsToday };
  } else {
    days.push({ date: today, wordCount: wordsToday });
  }

  // Recalculate streak
  const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));
  let current = 1;
  let longest = data.longestStreak;

  for (let i = sortedDays.length - 1; i > 0; i--) {
    const curr = new Date(sortedDays[i].date);
    const prev = new Date(sortedDays[i - 1].date);
    const diff = (curr.getTime() - prev.getTime()) / 86_400_000;
    if (diff === 1) current++;
    else break;
  }

  if (current > longest) longest = current;

  const totalWords = days.reduce((s, d) => s + d.wordCount, 0);

  await setDoc(ref, {
    ...data,
    days,
    currentStreak: current,
    longestStreak: longest,
    totalWords,
    lastActiveDate: today,
  } satisfies StreakData);
}
