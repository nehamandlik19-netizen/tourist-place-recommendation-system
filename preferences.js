import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


let currentUser = null;


onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    currentUser = user;

});


const form = document.getElementById("preferenceForm");


if (form) {

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!currentUser) {
            alert("Please login first.");
            return;
        }

        const message =
            document.getElementById("preferenceMessage");


        const state =
            document.getElementById("state").value;

        const category =
            document.getElementById("category").value;

        const budget =
            Number(document.getElementById("budget").value);

        const activity =
            document.getElementById("activity").value;

        const season =
            document.getElementById("season").value;

        const duration =
            document.getElementById("duration").value;


        message.textContent =
            "Finding destinations for you...";


        try {

            await setDoc(
                doc(db, "preferences", currentUser.uid),
                {
                    userId: currentUser.uid,
                    state,
                    category,
                    budget,
                    activity,
                    season,
                    duration,
                    updatedAt: serverTimestamp()
                }
            );


            /* Send selected preferences to recommendations page */

            const params = new URLSearchParams();

            params.set("personalized", "true");
            params.set("state", state);
            params.set("category", category);
            params.set("budget", budget);
            params.set("activity", activity);
            params.set("season", season);
            params.set("duration", duration);


            window.location.href =
                "recommendations.html?" + params.toString();


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to save your preferences.";

            message.classList.add("error-message");

        }

    });

}