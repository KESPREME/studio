// src/lib/firebase-admin.ts
import { initializeApp, getApps, getApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let serviceAccount: ServiceAccount | undefined;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
     serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY env var not set. Firebase Admin SDK might not initialize correctly.");
  }
} catch (e) {
  console.error('Could not parse Firebase service account key. Please ensure it is a valid JSON string in the FIREBASE_SERVICE_ACCOUNT_KEY environment variable.', e);
  serviceAccount = undefined;
}

const app = !getApps().length && serviceAccount
  ? initializeApp({ credential: cert(serviceAccount) })
  : getApp();

const db = getFirestore(app);

export { db };
