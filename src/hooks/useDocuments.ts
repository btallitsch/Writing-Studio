import { useState, useEffect, useCallback, useRef } from 'react';
import {
  subscribeDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
} from '../services/documents';
import { recordWords } from '../services/streak';
import type { Document } from '../types';
import { countWords } from '../utils/dates';

export function useDocuments(userId: string | undefined) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId) { setDocuments([]); setLoading(false); return; }
    setLoading(true);
    const unsub = subscribeDocuments(userId, data => {
      setDocuments(data);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  const activeDoc = documents.find(d => d.id === activeId) ?? null;

  const createDoc = async (title = 'Untitled') => {
    if (!userId) return;
    await addDocument({
      title,
      content: '',
      wordCount: 0,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  const saveContent = useCallback(
    (id: string, content: string, title: string) => {
      if (!userId) return;
      const wordCount = countWords(content);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await updateDocument(id, { content, title, wordCount, updatedAt: Date.now() });
        await recordWords(userId, wordCount);
      }, 800);
    },
    [userId]
  );

  const removeDoc = (id: string) => {
    if (activeId === id) setActiveId(null);
    return deleteDocument(id);
  };

  return { documents, activeDoc, activeId, setActiveId, loading, createDoc, saveContent, removeDoc };
}
