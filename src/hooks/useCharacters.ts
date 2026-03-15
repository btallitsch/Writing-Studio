import { useState, useEffect } from 'react';
import {
  subscribeCharacters,
  addCharacter,
  updateCharacter,
  deleteCharacter,
} from '../services/characters';
import type { Character, CharacterRole } from '../types';

const AVATAR_COLORS = [
  '#c0392b', '#8e44ad', '#2980b9', '#27ae60',
  '#e67e22', '#16a085', '#d35400', '#2c3e50',
];

export function useCharacters(userId: string | undefined) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setCharacters([]); setLoading(false); return; }
    setLoading(true);
    const unsub = subscribeCharacters(userId, data => {
      setCharacters(data);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  const create = async (
    name: string,
    role: CharacterRole,
    backstory: string,
    motivation: string,
    traits: string[],
    age?: string
  ) => {
    if (!userId) return;
    const avatarColor = AVATAR_COLORS[characters.length % AVATAR_COLORS.length];
    await addCharacter({
      name, role, backstory, motivation, traits, age,
      avatarColor,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  const update = (id: string, data: Partial<Omit<Character, 'id'>>) =>
    updateCharacter(id, data);

  const remove = (id: string) => deleteCharacter(id);

  return { characters, loading, create, update, remove };
}
