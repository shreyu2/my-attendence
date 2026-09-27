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
    googleSignUpBtn.innerHTML = "Authenticating...";

    try {
        const isNative =
            window.location.protocol === "capacitor:" ||
            window.Capacitor?.isNativePlatform?.();

        console.log("Is native:", isNative);

        if (isNative) {
            console.log("Starting native Google Sign-In...");

            const result =
                await FirebaseAuthentication.signInWithGoogle();

            console.log("Google authentication result:", result);

            window.location.replace("index.html");

            return;
        }

        console.log("Starting web Google Sign-In...");

        await signInWithPopup(auth, googleProvider);

        console.log("Web Google authentication successful.");

        window.location.replace("index.html");

    } catch (error) {
        console.error("Google authentication failed:", error);
        console.error("Error code:", error?.code);
        console.error("Error message:", error?.message);

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


/* THIS WAS MISSING */
googleSignUpBtn.addEventListener("click", googleAuth);