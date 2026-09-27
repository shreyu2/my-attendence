import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyDy_YkXM-wQh_HLjs0Pm7YZo2qKV2E-8es",

    authDomain:
        "my-attendence-33585.firebaseapp.com",

    projectId:
        "my-attendence-33585",

    storageBucket:
        "my-attendence-33585.firebasestorage.app",

    messagingSenderId:
        "171435955609",

    appId:
        "1:171435955609:web:be7e1724a91845ccf36f08",

    measurementId:
        "G-02ZXF8S8N3"
};


const app =
    initializeApp(firebaseConfig);


export const auth =
    getAuth(app);


export const googleProvider =
    new GoogleAuthProvider();


export const db =
    getFirestore(app);