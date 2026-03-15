import { useState, useEffect } from 'react';
import { subscribeIdeas, addIdea, updateIdea, deleteIdea } from '../services/ideas';
import type { Idea, IdeaMood } from '../types';

export function useIdeas(userId: string | undefined) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setIdeas([]); setLoading(false); return; }
    setLoading(true);
    const unsub = subscribeIdeas(userId, data => {
      setIdeas(data);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  const create = async (
    title: string,
    content: string,
    tags: string[],
    mood: IdeaMood
  ) => {
    if (!userId) return;
    await addIdea({
      title, content, tags, mood,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  const update = (id: string, data: Partial<Omit<Idea, 'id'>>) =>
    updateIdea(id, data);

  const remove = (id: string) => deleteIdea(id);

  return { ideas, loading, create, update, remove };
}
