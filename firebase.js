//---------------------------------------------------------------------
// Your web app's Firebase configuration (9 lines of code)
// Replace the configuration with YOUR project's API information
// copied from the firebase console (settings) of your project.
//---------------------------------------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyBX6Aw9cwPLSZQ4eekPNz1ghmL54cg5Ry0",
    authDomain: "demo1-ee1c1.firebaseapp.com",
    databaseURL: "https://demo1-ee1c1.firebaseio.com",
    projectId: "demo1-ee1c1",
    storageBucket: "demo1-ee1c1.appspot.com",
    messagingSenderId: "819699460697",
    appId: "1:819699460697:web:cbb0091717329539eadf48",
};
//------------------------------------------------
// Initialize Firebase and Firestore reference
// Do not delete!
//------------------------------------------------
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();