import { useState, useEffect } from 'react';
import { subscribeStreak } from '../services/streak';
import type { StreakData } from '../types';

export function useStreak(userId: string | undefined) {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setStreak(null); setLoading(false); return; }
    setLoading(true);
    const unsub = subscribeStreak(userId, data => {
      setStreak(data);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  return { streak, loading };
}
