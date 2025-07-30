// src/lib/api.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Report } from '@/lib/types';

export async function getReports(): Promise<Report[]> {
  try {
    const reportsCollection = collection(db, 'reports');
    const q = query(reportsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const reports = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
        updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
        resolvedAt: data.resolvedAt ? (data.resolvedAt as Timestamp).toDate().toISOString() : undefined,
      } as Report;
    });
    
    return reports;
  } catch (e: any) {
    console.error('Firestore getReports Error:', e);
    // In case of an error, return an empty array to prevent the page from crashing.
    return [];
  }
}
