import { auth, googleProvider } from "./firebase.js";

import {
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


const googleSignInBtn =
    document.getElementById("googleSignInBtn");

const googleSignUpBtn =
    document.getElementById("googleSignUpBtn");


// Google authentication
async function googleAuth() {

    try {

        await signInWithPopup(auth, googleProvider);

        window.location.href = "index.html";

    } catch (error) {

        console.error("Google authentication failed:", error);

        alert(
            "Google authentication failed. Please try again."
        );
    }
}


// Sign in
googleSignInBtn.addEventListener("click", googleAuth);


// Sign up
googleSignUpBtn.addEventListener("click", googleAuth);


// If already logged in, go directly to dashboard
onAuthStateChanged(auth, (user) => {

    if (user) {

        window.location.href = "index.html";

    }

});