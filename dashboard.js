import {
    auth
} from "./firebase-config.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";



const logoutButton =
    document.getElementById("logoutButton");



onAuthStateChanged(
    auth,
    function(user) {

        if (!user) {

            window.location.href =
                "login.html";

        }

    }
);



logoutButton.addEventListener(
    "click",
    async function(event) {

        event.preventDefault();

        await signOut(auth);

        window.location.href =
            "../index.html";

    }
);