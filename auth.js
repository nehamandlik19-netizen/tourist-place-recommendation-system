import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// =====================================================
// NAVBAR LOGIN / LOGOUT
// =====================================================

function updateNavbar(user) {

    // Select the guest and user elements from your HTML
    const guestContainer = document.querySelector(".guest-only");
    const userContainer = document.querySelector(".user-only");
    const logoutButton = document.querySelector(".header-logout");

    if (user) {

        // =================================================
        // USER IS LOGGED IN
        // =================================================

        // Hide guest buttons (Login/Register) & show user links (Dashboard/Favourite/Logout)
        if (guestContainer) guestContainer.classList.add("hidden");
        if (userContainer) userContainer.classList.remove("hidden");

        // Attach logout click listener
        if (logoutButton && !logoutButton.dataset.listenerAttached) {

            logoutButton.dataset.listenerAttached = "true";

            logoutButton.addEventListener("click", async function() {

                try {

                    await signOut(auth);

                    // Go to Home page after logout
                    window.location.href = "index.html";

                } catch (error) {

                    console.error("Logout error:", error);

                    alert("Unable to logout. Please try again.");

                }

            });

        }

    } else {

        // =================================================
        // USER IS LOGGED OUT
        // =================================================

        // Show guest buttons & hide user links
        if (guestContainer) guestContainer.classList.remove("hidden");
        if (userContainer) userContainer.classList.add("hidden");

    }

}


// =====================================================
// CHECK FIREBASE LOGIN STATE ON EVERY PAGE
// =====================================================

onAuthStateChanged(
    auth,
    function(user) {

        updateNavbar(user);

    }
);


// =====================================================
// LOGIN PAGE
// =====================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    onAuthStateChanged(
        auth,
        function(user) {

            if (user) {

                window.location.href =
                    "dashboard.html";

            }

        }
    );


    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                document.getElementById("loginEmail")
                .value
                .trim();


            const password =
                document.getElementById("loginPassword")
                .value;


            const message =
                document.getElementById("loginMessage");


            message.textContent =
                "Logging in...";


            try {

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                const userDocument =
                    await getDoc(
                        doc(db, "users", user.uid)
                    );


                if (
                    userDocument.exists()
                    &&
                    userDocument.data().role === "admin"
                ) {

                    window.location.href =
                        "admin.html";

                } else {

                    window.location.href =
                        "dashboard.html";

                }


            } catch (error) {

                console.error(error);

                message.textContent =
                    "Invalid email or password.";

            }

        }
    );

}


// =====================================================
// REGISTER PAGE
// =====================================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    onAuthStateChanged(
        auth,
        function(user) {

            if (user) {

                window.location.href =
                    "dashboard.html";

            }

        }
    );


    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById("name")
                .value
                .trim();


            const email =
                document.getElementById("email")
                .value
                .trim();


            const password =
                document.getElementById("password")
                .value;


            const message =
                document.getElementById("registerMessage");


            message.textContent =
                "Creating account...";


            try {

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                await setDoc(
                    doc(db, "users", user.uid),
                    {

                        name: name,

                        email: email,

                        role: "user",

                        createdAt: new Date()

                    }
                );


                /*
                    Firebase automatically signs the user in
                    after registration.

                    We sign out here because our flow is:

                    Register → Login → Dashboard
                */

                await signOut(auth);


                message.textContent =
                    "Registration successful! Redirecting to login...";


                setTimeout(
                    function() {

                        window.location.href =
                            "login.html";

                    },
                    1200
                );


            } catch (error) {

                console.error(error);


                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message.textContent =
                        "This email is already registered.";

                } else {

                    message.textContent =
                        error.message;

                }

            }

        }
    );

}