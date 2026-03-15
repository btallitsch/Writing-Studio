import { useState, useEffect } from 'react';
import {
  subscribeStoryCards,
  addStoryCard,
  updateStoryCard,
  deleteStoryCard,
} from '../services/stories';
import type { StoryCard, StoryBeat } from '../types';

export function useStory(userId: string | undefined) {
  const [cards, setCards] = useState<StoryCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setCards([]); setLoading(false); return; }
    setLoading(true);
    const unsub = subscribeStoryCards(userId, data => {
      setCards(data.sort((a, b) => a.order - b.order));
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  const create = async (title: string, description: string, beat: StoryBeat) => {
    if (!userId) return;
    const beatCards = cards.filter(c => c.beat === beat);
    await addStoryCard({
      title, description, beat,
      order: beatCards.length,
      userId,
      createdAt: Date.now(),
    });
  };

  const update = (id: string, data: Partial<Omit<StoryCard, 'id'>>) =>
    updateStoryCard(id, data);

  const remove = (id: string) => deleteStoryCard(id);

  return { cards, loading, create, update, remove };
}
