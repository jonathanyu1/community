import firebase from 'firebase';

// var firebaseConfig = {
//     apiKey: "AIzaSyDwacW4xbxWx9-BDMst6NBLL_SNxKffYGk",
//     authDomain: "community-83f47.firebaseapp.com",
//     projectId: "community-83f47",
//     storageBucket: "community-83f47.appspot.com",
//     messagingSenderId: "824710866837",
//     appId: "1:824710866837:web:fc8f3a73a8917f19a8b89c",
//     measurementId: "G-M6H714GG16"
//   };

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
export default firebase;
export const fs = firebase.firestore();
export const auth = firebase.auth;
