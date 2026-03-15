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
import type { Document } from '../types';

const COL = 'documents';

export function subscribeDocuments(
  userId: string,
  cb: (docs: Document[]) => void
): Unsubscribe {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, snap =>
    cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Document)))
  );
}

export async function addDocument(data: Omit<Document, 'id'>): Promise<void> {
  await addDoc(collection(db, COL), data);
}

export async function updateDocument(
  id: string,
  data: Partial<Omit<Document, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), data);
}

export async function deleteDocument(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
