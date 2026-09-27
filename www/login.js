import { auth, googleProvider } from "./firebase.js";

import {
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { FirebaseAuthentication } from "./native-auth.js";

const googleSignUpBtn = document.getElementById("googleSignUpBtn");

async function googleAuth() {
    if (!googleSignUpBtn) {
        console.error("Google button not found.");
        return;
    }

    googleSignUpBtn.disabled = true;
    googleSignUpBtn.textContent = "Authenticating...";

    try {
        const isNative =
            window.location.protocol === "capacitor:" ||
            window.Capacitor?.isNativePlatform?.();

        /*
         * ANDROID / CAPACITOR
         */
        if (isNative) {

            console.log("Starting native Google authentication...");

            await FirebaseAuthentication.signInWithGoogle();

            console.log("Google authentication successful.");

            // Directly go to dashboard.
            window.location.replace("index.html");

            return;
        }

        /*
         * WEBSITE / CLOUDFLARE
         */
        console.log("Starting web Google authentication...");

        await signInWithPopup(auth, googleProvider);

        console.log("Google authentication successful.");

        // Directly go to dashboard.
        window.location.replace("index.html");

    } catch (error) {

        console.error("Google authentication failed.");
        console.error("Error code:", error?.code);
        console.error("Error message:", error?.message);
        console.error("Full error:", error);

        alert(
            "Google authentication failed.\n\n" +
            (error?.message || "Please try again.")
        );

        googleSignUpBtn.disabled = false;
        googleSignUpBtn.innerHTML = `
            <span class="google-icon">G</span>
            Continue with Google
        `;
    }
}