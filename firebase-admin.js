// const admin = require('firebase-admin');

// const serviceAccount = require('./firebasejson.json'); // Replace with your downloaded JSON file path

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://ig-api-demo.firebaseio.com' // Replace with your Firebase project ID
// });

// module.exports = admin;

import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Initialize Firebase Admin SDK only if it's not already initialized

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});


export { admin };
