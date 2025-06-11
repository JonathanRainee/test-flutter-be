require("dotenv").config()
import { initializeApp } from "firebase/app";
import admin from 'firebase-admin';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain:  process.env.FIREBASE_AUTH_DOMAIN,
  projectId:  process.env.FIREBASE_PROJECT_ID,
  storageBucket:  process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId:  process.env.FIREBASE_APP_ID
};

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;
let app;

try {
    if (!admin.apps.length) {
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
            });
            console.log('Firebase Admin SDK initialized with GOOGLE_APPLICATION_CREDENTIALS');
        }
        else {
            try {
                const serviceAccount = require('../public/serviceaccountkey.json');
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                console.log('Firebase Admin SDK initialized with serviceAccountKey.json');
            } catch (e) {
                console.error("Error loading serviceAccountKey.json:", e);
                throw e; 
            }
        }
        app = initializeApp(firebaseConfig);
        db = admin.firestore();
        auth = admin.auth();
    } else {
        app = initializeApp(firebaseConfig);
        db = admin.firestore();
        auth = admin.auth();
        console.log('Firebase Admin SDK already initialized.');
    }
} catch (error: any) {
    console.error('Firebase Admin initialization error:', error);
    process.exit(1);
}

export { app, db, auth, admin };