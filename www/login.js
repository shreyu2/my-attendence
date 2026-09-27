import { auth } from "./firebase.js";

import {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { FirebaseAuthentication } from "./native-auth.js";


/* =========================
   GOOGLE BUTTON
========================= */

const googleSignUpBtn =
    document.getElementById("googleSignUpBtn");


/* =========================
   GOOGLE AUTHENTICATION
========================= */

async function googleAuth() {

    if (!googleSignUpBtn) {

        console.error(
            "Google button not found."
        );

        return;

    }


    googleSignUpBtn.disabled =
        true;

    googleSignUpBtn.innerHTML =
        "Authenticating...";


    try {

        /*
         * Check whether this is
         * the Android Capacitor app.
         */

        const isNative =
            window.location.protocol === "capacitor:" ||
            window.Capacitor?.isNativePlatform?.();


        /* =========================
           ANDROID / CAPACITOR
        ========================= */

        if (isNative) {

            console.log(
                "Starting native Google Sign-In..."
            );


            /*
             * Native Google authentication.
             *
             * skipNativeAuth = true means
             * the plugin gives us the Google
             * credential instead of maintaining
             * a separate native Firebase session.
             */

            const result =
                await FirebaseAuthentication.signInWithGoogle();


            console.log(
                "Native Google result:",
                result
            );


            /*
             * Get the Google ID token.
             */

            const idToken =
                result?.credential?.idToken;


            if (!idToken) {

                throw new Error(
                    "Google authentication succeeded, but no ID token was returned."
                );

            }


            console.log(
                "Google ID token received."
            );


            /*
             * Convert Google ID token into
             * a Firebase Web SDK credential.
             */

            const credential =
                GoogleAuthProvider.credential(
                    idToken
                );


            /*
             * IMPORTANT:
             *
             * This signs the user into the
             * Firebase Web SDK.
             *
             * Your index.html/script.js
             * will now see the authenticated
             * user through onAuthStateChanged().
             */

            await signInWithCredential(
                auth,
                credential
            );


            console.log(
                "Firebase Web authentication successful."
            );


            /*
             * Give Firebase a moment to update
             * its authentication state.
             */

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        300
                    )
            );


            /*
             * Go to attendance dashboard.
             */

            window.location.replace(
                "./index.html"
            );


            return;

        }


        /* =========================
           WEBSITE
        ========================= */

        console.log(
            "Starting web Google Sign-In..."
        );


        /*
         * Website continues using the
         * normal Firebase popup.
         */

        const provider =
            new GoogleAuthProvider();


        await signInWithPopup(
            auth,
            provider
        );


        console.log(
            "Web Google authentication successful."
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


        googleSignUpBtn.disabled =
            false;


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


/* =========================
   BUTTON CLICK
========================= */

googleSignUpBtn.addEventListener(
    "click",
    googleAuth
);