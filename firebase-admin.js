// const admin = require('firebase-admin');

// const serviceAccount = require('./firebasejson.json'); // Replace with your downloaded JSON file path

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://ig-api-demo.firebaseio.com' // Replace with your Firebase project ID
// });

// module.exports = admin;

import admin from 'firebase-admin';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize Firebase Admin SDK only if it's not already initialized
if (!admin.apps.length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = getFirestore();

export { admin, db };
