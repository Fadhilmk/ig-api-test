const admin = require('firebase-admin');

const serviceAccount = require('./firebasejson.json'); // Replace with your downloaded JSON file path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ig-api-demo.firebaseio.com' // Replace with your Firebase project ID
});

module.exports = admin;
