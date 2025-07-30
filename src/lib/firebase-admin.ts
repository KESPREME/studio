// src/lib/firebase-admin.ts
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// IMPORTANT: You must generate your own service account key file in the
// Firebase console and place it in your project.
// Go to Project settings > Service accounts > Generate new private key
// Then, you need to set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// to the path of this file. For this demo, we'll try to read it from an env var.

let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
     serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    // Fallback for local development if you use a file
    // serviceAccount = require('../../serviceAccountKey.json');
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY env var not set. Firebase Admin SDK might not initialize.");
  }
} catch (e) {
  console.error('Could not parse Firebase service account key. Please ensure it is a valid JSON string in the FIREBASE_SERVICE_ACCOUNT_KEY environment variable.', e);
}


const app = !getApps().length 
  ? initializeApp({
      credential: cert(serviceAccount || {})
    }) 
  : getApp();

const db = getFirestore(app);

export { app, db };
