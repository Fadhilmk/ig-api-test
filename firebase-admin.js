// const admin = require('firebase-admin');

// const serviceAccount = require('./firebasejson.json'); // Replace with your downloaded JSON file path

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://ig-api-demo.firebaseio.com' // Replace with your Firebase project ID
// });

// module.exports = admin;

// firebase-admin.js

import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Check if Firebase Admin SDK is already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
}

const db = admin.firestore();
export { admin, db };
