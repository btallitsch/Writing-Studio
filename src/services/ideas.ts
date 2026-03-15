import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Idea } from '../types';

const COL = 'ideas';

export function subscribeIdeas(
  userId: string,
  cb: (ideas: Idea[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Idea)))
  );
}

export async function addIdea(
  data: Omit<Idea, 'id'>
): Promise<void> {
  await addDoc(collection(db, COL), data);
}

export async function updateIdea(
  id: string,
  data: Partial<Omit<Idea, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: Date.now() });
}

export async function deleteIdea(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
