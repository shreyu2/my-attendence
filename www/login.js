import { auth, googleProvider } from "./firebase.js";

import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithCredential
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const googleSignUpBtn =
    document.getElementById("googleSignUpBtn");


async function googleAuth() {

    if (!googleSignUpBtn) {
        console.error("Google button not found.");
        return;
    }

    googleSignUpBtn.disabled = true;

    googleSignUpBtn.innerHTML = `
        <span class="google-icon">G</span>
        Authenticating...
    `;

    try {

        /*
         * Detect Android / Capacitor
         */
        const isNative =
            window.Capacitor &&
            typeof window.Capacitor.isNativePlatform === "function" &&
            window.Capacitor.isNativePlatform();


        /* =========================================
           ANDROID APK
        ========================================= */

        if (isNative) {

            console.log(
                "Android app detected."
            );

            /*
             * Load the native Firebase plugin
             * ONLY inside the Android app.
             *
             * The website will never execute this.
             */
            const {
                FirebaseAuthentication
            } = await import("./native-auth.js");


            console.log(
                "Firebase native plugin loaded."
            );


            const result =
                await FirebaseAuthentication.signInWithGoogle();


            console.log(
                "Native Google result:",
                result
            );


            const idToken =
                result?.credential?.idToken;


            if (!idToken) {

                throw new Error(
                    "Google ID token was not returned."
                );

            }


            /*
             * Convert native Google token
             * into Firebase Web SDK credential.
             */

            const credential =
                GoogleAuthProvider.credential(
                    idToken
                );


            await signInWithCredential(
                auth,
                credential
            );


            console.log(
                "Firebase authentication successful."
            );


            window.location.replace(
                "./index.html"
            );


            return;
        }


        /* =========================================
           WEBSITE
        ========================================= */

        console.log(
            "Website detected."
        );


        /*
         * Normal Firebase Web authentication.
         *
         * No Capacitor plugin is loaded here.
         */

        await signInWithPopup(
            auth,
            googleProvider
        );


        console.log(
            "Website Google authentication successful."
        );


        window.location.replace(
            "./index.html"
        );

    } catch (error) {

        console.error(
            "Google authentication failed:",
            error
        );

        console.error(
            "Error code:",
            error?.code
        );

        console.error(
            "Error message:",
            error?.message
        );


        googleSignUpBtn.disabled = false;

        googleSignUpBtn.innerHTML = `
            <span class="google-icon">G</span>
            Continue with Google
        `;


        alert(
            "Google authentication failed.\n\n" +
            (
                error?.message ||
                "Please try again."
            )
        );

    }

}


/* =========================================
   GOOGLE BUTTON
========================================= */

googleSignUpBtn.addEventListener(
    "click",
    googleAuth
);