import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { StoryCard } from '../types';

const COL = 'storyCards';

export function subscribeStoryCards(
  userId: string,
  cb: (cards: StoryCard[]) => void
): Unsubscribe {
  const q = query(collection(db, COL), where('userId', '==', userId));
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as StoryCard)))
  );
}

export async function addStoryCard(data: Omit<StoryCard, 'id'>): Promise<void> {
  await addDoc(collection(db, COL), data);
}

export async function updateStoryCard(
  id: string,
  data: Partial<Omit<StoryCard, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), data);
}

export async function deleteStoryCard(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
