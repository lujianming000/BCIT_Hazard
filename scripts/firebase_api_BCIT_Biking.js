//---------------------------------------------------------------------
// Your web app's Firebase configuration (9 lines of code)
// Replace the configuration with YOUR project's API information
// copied from the firebase console (settings) of your project.
//---------------------------------------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyCzyZbbclO79H4V_lZkKngHURiZY62Q114",
    authDomain: "bcit-biking.firebaseapp.com",
    databaseURL: "https://bcit-biking.firebaseio.com",
    projectId: "bcit-biking",
    storageBucket: "bcit-biking.appspot.com",
    messagingSenderId: "664622003212",
    appId: "1:664622003212:web:b52a8acc5469b262baea29"
};
//------------------------------------------------
// Initialize Firebase and Firestore reference
// Do not delete!
//------------------------------------------------
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();