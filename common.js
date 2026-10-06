import { auth } from "./firebase-config.js";
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

/* =========================================================
   LOGIN / LOGOUT & AUTHENTICATION GUARD
========================================================= */

onAuthStateChanged(auth, (user) => {
    const guestActions = document.getElementById("guestActions");
    const userActions = document.getElementById("userActions");

    // Toggle navigation UI visibility based on auth state
    if (guestActions) {
        guestActions.classList.toggle("hidden", !!user);
    }

    if (userActions) {
        userActions.classList.toggle("hidden", !user);
    }

    // Optional Protection: Redirect logged-out users away from protected pages
    const isProtectedPage = ["dashboard.html", "favorites.html", "recommendations.html"]
        .some(page => window.location.pathname.includes(page));

    if (!user && isProtectedPage) {
        const loginRedirect = window.location.pathname.includes("/pages/")
            ? "login.html"
            : "pages/login.html";
        window.location.href = loginRedirect;
    }
});

/* =========================================================
   LOGOUT
========================================================= */

const logoutButtons = document.querySelectorAll(".logout-button, #homeLogoutButton");

logoutButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
            await signOut(auth);

            // Redirect back to home or login page after sign-out
            window.location.href = window.location.pathname.includes("/pages/")
                ? "../index.html"
                : "index.html";
        } catch (error) {
            console.error("Logout error:", error);
            alert("Unable to logout. Please try again.");
        }
    });
});

/* =========================================================
   GLOBAL SEARCH
========================================================= */

const searchForm = document.getElementById("globalSearchForm");
const searchInput = document.getElementById("globalSearch");

if (searchForm && searchInput) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const value = searchInput.value.trim();
        if (!value) return;

        const destination = window.location.pathname.includes("/pages/")
            ? "recommendations.html"
            : "pages/recommendations.html";

        window.location.href = `${destination}?search=${encodeURIComponent(value)}`;
    });
}