import { auth, googleProvider } from "./firebase.js";

import {
    signInWithPopup,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { FirebaseAuthentication } from "./native-auth.js";

const googleSignInBtn = document.getElementById("googleSignInBtn");
const googleSignUpBtn = document.getElementById("googleSignUpBtn");

async function googleAuth() {
    try {
        const isNative =
            window.location.protocol === "capacitor:" ||
            window.Capacitor?.isNativePlatform?.();

        console.log("Native app:", isNative);

        if (isNative) {
            console.log("Starting native Google Sign-In...");

            const result =
                await FirebaseAuthentication.signInWithGoogle();

            console.log("Native Google Sign-In result:", result);

            /*
             * Native plugin has already authenticated
             * the user with Firebase.
             */
            window.location.href = "index.html";

            return;
        }

        /*
         * Website:
         * Continue using normal Firebase popup authentication.
         */
        await signInWithPopup(auth, googleProvider);

        window.location.href = "index.html";

    } catch (error) {
        console.error("========== GOOGLE AUTH ERROR ==========");
        console.error("Code:", error?.code);
        console.error("Message:", error?.message);
        console.error("Full error:", error);
        console.error("======================================");

        alert(
            "Google authentication failed.\n\n" +
            "Code: " +
            (error?.code || "unknown") +
            "\n\n" +
            (error?.message || "Unknown error")
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