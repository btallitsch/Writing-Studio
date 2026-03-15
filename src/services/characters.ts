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
import type { Character } from '../types';

const COL = 'characters';

export function subscribeCharacters(
  userId: string,
  cb: (chars: Character[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Character)))
  );
}

export async function addCharacter(data: Omit<Character, 'id'>): Promise<void> {
  await addDoc(collection(db, COL), data);
}

export async function updateCharacter(
  id: string,
  data: Partial<Omit<Character, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: Date.now() });
}

export async function deleteCharacter(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
