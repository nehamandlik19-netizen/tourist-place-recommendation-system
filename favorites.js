import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// =====================================================
// DOM ELEMENTS
// =====================================================

const container = document.getElementById("favoriteContainer");
const loading = document.getElementById("favoritesLoading");
const emptyState = document.getElementById("emptyFavorites");
const noResults = document.getElementById("noFilterResults");
const favoriteCount = document.getElementById("favoriteCount");
const searchInput = document.getElementById("favoriteSearch");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortFavorites");
const clearFiltersButton = document.getElementById("clearFilters");


let allFavorites = [];


// =====================================================
// IMAGE HELPER
// =====================================================

function getImage(favorite) {
    return (
        favorite.image ||
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
    );
}


// =====================================================
// CREATE FAVORITE CARD HTML
// =====================================================

function createFavoriteCard(favorite) {
    // Generate URL key matching place-details.js requirements
    const placeKey =
        favorite.placeId ||
        String(favorite.placeName || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

    return `
        <article class="destination-card">

            <div class="destination-image">
                <img
                    src="${getImage(favorite)}"
                    alt="${favorite.placeName || "Tourist place"}"
                    loading="lazy"
                >

                <button
                    class="favorite-heart active"
                    onclick="removeFavorite('${favorite.id}')"
                    title="Remove from favorites"
                    type="button"
                >
                    ♥
                </button>

                <span class="destination-badge">
                    ${favorite.category || "Destination"}
                </span>
            </div>

            <div class="destination-content">

                <div class="rating">
                    ★ ${Number(favorite.rating || 0).toFixed(1)}
                </div>

                <h3>
                    ${favorite.placeName || "Unknown Place"}
                </h3>

                <p class="location">
                    📍 ${favorite.city || ""}${favorite.city && favorite.state ? ", " : ""}${favorite.state || ""}
                </p>

                <p class="budget">
                    From ₹${Number(favorite.budget || 0).toLocaleString("en-IN")}
                </p>

                <div class="favorite-card-actions">
                    <a
                        href="place-details.html?place=${encodeURIComponent(placeKey)}"
                        class="card-button"
                    >
                        View Details
                    </a>

                    <button
                        class="remove-favorite-button"
                        onclick="removeFavorite('${favorite.id}')"
                        type="button"
                    >
                        Remove
                    </button>
                </div>

            </div>

        </article>
    `;
}


// =====================================================
// REMOVE FAVORITE FROM FIRESTORE
// =====================================================

window.removeFavorite = async function (favoriteId) {
    const confirmed = confirm("Remove this destination from your favorites?");

    if (!confirmed) return;

    try {
        await deleteDoc(doc(db, "favorites", favoriteId));

        // Filter out removed favorite locally
        allFavorites = allFavorites.filter((item) => item.id !== favoriteId);

        updateCount();
        renderFavorites();
    } catch (error) {
        console.error("Remove favorite error:", error);
        alert("Unable to remove favorite. Please try again.");
    }
};


// =====================================================
// UPDATE COUNTER
// =====================================================

function updateCount() {
    if (favoriteCount) {
        favoriteCount.textContent = allFavorites.length;
    }
}


// =====================================================
// GET SAVED TIMESTAMP
// =====================================================

function getTime(value) {
    if (!value) return 0;

    if (value.seconds) {
        return value.seconds * 1000;
    }

    if (typeof value.toMillis === "function") {
        return value.toMillis();
    }

    return new Date(value).getTime() || 0;
}


// =====================================================
// SORT FAVORITES
// =====================================================

function sortFavorites(items) {
    const result = [...items];

    switch (sortSelect ? sortSelect.value : "recent") {
        case "rating":
            result.sort(
                (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
            );
            break;

        case "name":
            result.sort((a, b) =>
                (a.placeName || "").localeCompare(b.placeName || "")
            );
            break;

        case "budget-low":
            result.sort(
                (a, b) => Number(a.budget || 0) - Number(b.budget || 0)
            );
            break;

        case "budget-high":
            result.sort(
                (a, b) => Number(b.budget || 0) - Number(a.budget || 0)
            );
            break;

        default:
            result.sort(
                (a, b) => getTime(b.savedAt) - getTime(a.savedAt)
            );
            break;
    }

    return result;
}


// =====================================================
// FILTER FAVORITES
// =====================================================

function filterFavorites() {
    const search = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const category = categoryFilter ? categoryFilter.value : "all";

    let result = [...allFavorites];

    if (search) {
        result = result.filter((item) => {
            const text = [item.placeName, item.city, item.state, item.category]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return text.includes(search);
        });
    }

    if (category && category !== "all") {
        result = result.filter((item) => item.category === category);
    }

    return sortFavorites(result);
}


// =====================================================
// RENDER FAVORITES
// =====================================================

function renderFavorites() {
    const result = filterFavorites();

    // 1. NO FAVORITES SAVED
    if (allFavorites.length === 0) {
        if (container) container.innerHTML = "";
        if (emptyState) emptyState.classList.remove("hidden");
        if (noResults) noResults.classList.add("hidden");
        return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    // 2. NO RESULTS MATCHING FILTERS/SEARCH
    if (result.length === 0) {
        if (container) container.innerHTML = "";
        if (noResults) noResults.classList.remove("hidden");
        return;
    }

    if (noResults) noResults.classList.add("hidden");

    // 3. DISPLAY CARDS
    if (container) {
        container.innerHTML = result.map(createFavoriteCard).join("");
    }
}


// =====================================================
// LOAD FAVORITES FROM FIRESTORE
// =====================================================

async function loadFavorites() {
    if (loading) loading.classList.remove("hidden");

    try {
        const favoritesQuery = query(
            collection(db, "favorites"),
            where("userId", "==", auth.currentUser.uid)
        );

        const snapshot = await getDocs(favoritesQuery);

        allFavorites = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
        }));

        updateCount();
        renderFavorites();
    } catch (error) {
        console.error("Favorites error:", error);

        if (container) {
            container.innerHTML = `
                <div class="error-box">
                    <h3>Unable to load favorites</h3>
                    <p>Unable to load your saved destinations. Please try again.</p>
                </div>
            `;
        }
    } finally {
        if (loading) loading.classList.add("hidden");
    }
}


// =====================================================
// EVENT LISTENERS
// =====================================================

if (searchInput) {
    searchInput.addEventListener("input", renderFavorites);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", renderFavorites);
}

if (sortSelect) {
    sortSelect.addEventListener("change", renderFavorites);
}

if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        if (categoryFilter) categoryFilter.value = "all";
        if (sortSelect) sortSelect.value = "recent";
        renderFavorites();
    });
}


// =====================================================
// AUTHENTICATION CHECK & INITIALIZATION
// =====================================================

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadFavorites();
});