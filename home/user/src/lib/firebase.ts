// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "alertfront-czys9",
  appId: "1:752668007574:web:062c2403d39499bd30f6b7",
  storageBucket: "alertfront-czys9.appspot.com",
  apiKey: "AIzaSyCFvZ5__xwqc0JhWvU1TkqcVF-cveIFHYw",
  authDomain: "alertfront-czys9.firebaseapp.com",
  messagingSenderId: "752668007574"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
