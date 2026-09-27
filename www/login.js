import { auth, googleProvider } from "./firebase.js";

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
        /*
         * Android / Capacitor
         * -------------------
         * Use native Google Sign-In so Chrome does not open.
         */
        if (
            window.Capacitor &&
            window.Capacitor.isNativePlatform &&
            window.Capacitor.isNativePlatform()
        ) {
            const FirebaseAuthentication =
                window.Capacitor.Plugins.FirebaseAuthentication;

            if (!FirebaseAuthentication) {
                throw new Error(
                    "FirebaseAuthentication Capacitor plugin is not available."
                );
            }

            const result =
                await FirebaseAuthentication.signInWithGoogle({
                    skipNativeAuth: true
                });

            const idToken = result?.credential?.idToken;

            if (!idToken) {
                throw new Error(
                    "Google sign-in succeeded but no ID token was returned."
                );
            }

            /*
             * Convert the native Google credential into
             * a Firebase Web SDK credential.
             */
            const credential =
                GoogleAuthProvider.credential(idToken);

            await signInWithCredential(auth, credential);

            window.location.href = "index.html";
            return;
        }

        /*
         * Normal website / Cloudflare Pages
         * ---------------------------------
         * Keep using the existing Firebase popup login.
         */
        await signInWithPopup(auth, googleProvider);

        window.location.href = "index.html";

    } catch (error) {
        console.error("Google authentication failed:", error);

        console.error("Error code:", error?.code);
        console.error("Error message:", error?.message);

        alert(
            "Google authentication failed.\n\n" +
            (error?.message || "Please try again.")
        );
    }
}

googleSignInBtn.addEventListener("click", googleAuth);
googleSignUpBtn.addEventListener("click", googleAuth);


/*
 * If the user is already authenticated,
 * go directly to the dashboard.
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "index.html";
    }
});