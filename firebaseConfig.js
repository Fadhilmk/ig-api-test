// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_qO66jRXMoRcAeikXscjQHCShVDo__Iw",
  authDomain: "ig-api-demo.firebaseapp.com",
  projectId: "ig-api-demo",
  storageBucket: "ig-api-demo.appspot.com",
  messagingSenderId: "330821835334",
  appId: "1:330821835334:web:e1f5f6e7e408d395eb4847",
  measurementId: "G-EJ7WH7X1FB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };