// src/lib/firebase-admin.ts
import { initializeApp, getApps, getApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app;

if (!getApps().length) {
  let serviceAccount: ServiceAccount | undefined;
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY env var not set. Firebase Admin SDK might not initialize correctly.");
    }
  } catch (e) {
    console.error('Could not parse Firebase service account key.', e);
  }

  if (serviceAccount) {
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    console.error("Firebase Admin SDK failed to initialize: Service Account credentials are not available.");
  }
} else {
  app = getApp();
}

const db = app ? getFirestore(app) : null;

if (!db) {
    console.error("Firestore database could not be initialized.");
}

export { db };
