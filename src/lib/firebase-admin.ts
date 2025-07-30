// src/lib/firebase-admin.ts
import { initializeApp, getApps, getApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let serviceAccount: ServiceAccount | undefined;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
     serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    // Fallback for local development if you use a file.
    // Make sure to create this file and add your service account key to it.
    // Do not commit this file to your repository.
    // serviceAccount = require('../../../serviceAccountKey.json');
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY env var not set. Firebase Admin SDK might not initialize correctly.");
  }
} catch (e) {
  console.error('Could not parse Firebase service account key. Please ensure it is a valid JSON string in the FIREBASE_SERVICE_ACCOUNT_KEY environment variable.', e);
  serviceAccount = undefined;
}

if (!serviceAccount || !serviceAccount.projectId) {
  console.error("Firebase Admin SDK failed to initialize: Service account credentials are not valid or missing.");
  // To prevent the app from crashing in a confusing way later, we can stop here.
  // In a real app you might handle this more gracefully.
}

const app = !getApps().length && serviceAccount
