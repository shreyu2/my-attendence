import { auth, googleProvider } from "./firebase.js";
import { FirebaseAuthentication } from "./native-auth.js";

import {
    signInWithPopup,
    signInWithCredential,
    GoogleAuthProvider,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const googleSignInBtn = document.getElementById("googleSignInBtn");
const googleSignUpBtn = document.getElementById("googleSignUpBtn");

async function googleAuth() {
    try {
        const isNative =
            window.location.protocol === "capacitor:" ||
            window.location.hostname === "localhost";

        if (isNative) {
            console.log("Using native Google Sign-In");

            const result =
                await FirebaseAuthentication.signInWithGoogle({
                    skipNativeAuth: true
                });

            console.log("Native Google result:", result);

            const idToken = result?.credential?.idToken;

            if (!idToken) {
                throw new Error("No Google ID token was returned.");
            }

            const credential =
                GoogleAuthProvider.credential(idToken);

            await signInWithCredential(auth, credential);

            window.location.href = "index.html";
            return;
        }

        console.log("Using web Google Sign-In");

        await signInWithPopup(auth, googleProvider);

        window.location.href = "index.html";

    } catch (error) {
        console.error("Google authentication failed:", error);

        alert(
            "Google authentication failed.\n\n" +
            (error?.message || "Please try again.")
        );
    }
}

googleSignInBtn.addEventListener("click", googleAuth);
googleSignUpBtn.addEventListener("click", googleAuth);

onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "index.html";
    }
});