import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    initializeAuth,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "AIzaSyAtfWBqh1aqGTa7YoGhxHUohv1Ye3pJ35M",

    authDomain:
        "tourist-place-recommendor.firebaseapp.com",

    projectId:
        "tourist-place-recommendor",

    storageBucket:
        "tourist-place-recommendor.firebasestorage.app",

    messagingSenderId:
        "626033564649",

    appId:
        "1:626033564649:web:c8da5a483242bab7cd4978"

};


// Initialize Firebase

const app =
    initializeApp(firebaseConfig);


// Initialize Authentication

const auth =
    initializeAuth(app, {

        persistence:
            browserLocalPersistence

    });


// Initialize Firestore

const db =
    getFirestore(app);


// Export

export {
    app,
    auth,
    db
};