"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.auth = exports.db = exports.app = void 0;
require("dotenv").config();
const app_1 = require("firebase/app");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
exports.admin = firebase_admin_1.default;
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
let db;
let auth;
let app;
try {
    if (!firebase_admin_1.default.apps.length) {
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.applicationDefault(),
            });
            console.log('Firebase Admin SDK initialized with GOOGLE_APPLICATION_CREDENTIALS');
        }
        else {
            try {
                const serviceAccount = require('../public/serviceaccountkey.json');
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.cert(serviceAccount),
                });
                console.log('Firebase Admin SDK initialized with serviceAccountKey.json');
            }
            catch (e) {
                console.error("Error loading serviceAccountKey.json:", e);
                throw e;
            }
        }
        exports.app = app = (0, app_1.initializeApp)(firebaseConfig);
        exports.db = db = firebase_admin_1.default.firestore();
        exports.auth = auth = firebase_admin_1.default.auth();
    }
    else {
        exports.app = app = (0, app_1.initializeApp)(firebaseConfig);
        exports.db = db = firebase_admin_1.default.firestore();
        exports.auth = auth = firebase_admin_1.default.auth();
        console.log('Firebase Admin SDK already initialized.');
    }
}
catch (error) {
    console.error('Firebase Admin initialization error:', error);
    process.exit(1);
}
