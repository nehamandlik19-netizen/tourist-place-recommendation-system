import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// =====================================================
// CONTAINERS
// =====================================================

const placeContainer =
    document.getElementById("placeContainer");

const noResults =
    document.getElementById("noResults");


// =====================================================
// PLACE IMAGES
// =====================================================

const imageMap = {

    "Alibaug":
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",

    "Goa":
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",

    "Mahabaleshwar":
        "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=800&q=80",

    "Matheran":
        "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80",

    "Agra":
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",

    "Gir":
        "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80",

    "Leh":
        "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",

    "Lonavala":
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",

    "Manali":
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",

    "Tirupati":
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80",

    "Varanasi":
        "https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=800&q=80",

    "Rajasthan":
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",

    "Jaipur":
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80"

};


// =====================================================
// GET ALL PLACES
// =====================================================

async function getAllPlaces() {

    const snapshot =
        await getDocs(
            collection(db, "tourist_places")
        );


    const places = [];


    snapshot.forEach((document) => {

        places.push({

            id: document.id,

            ...document.data()

        });

    });


    return places;

}


// =====================================================
// DISPLAY PLACE CARDS
// =====================================================

function displayPlaces(places) {

    placeContainer.innerHTML = "";


    if (places.length === 0) {

        noResults.classList.remove("hidden");

        return;

    }


    noResults.classList.add("hidden");


    places.forEach((place) => {

        const name =
            place.name ||
            place.Name ||
            place.placeName ||
            "Unknown Place";


        const category =
            place.category ||
            place.Category ||
            "Destination";


        const city =
            place.city ||
            place.City ||
            "";


        const state =
            place.state ||
            place.State ||
            "";


        const rating =
            Number(
                place.rating ||
                place.Rating ||
                0
            );


        const image =
            imageMap[name] ||
            "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80";


        const slug =
            name
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-");


        const card =
            document.createElement("div");


        card.className =
            "destination-card";


        card.innerHTML = `

            <img
                src="${image}"
                alt="${name}"
                class="destination-image"
            >


            <div class="destination-card-content">

                <h3>
                    ${name}
                </h3>


                <p class="destination-location">
                    📍 ${city}${state ? ", " + state : ""}
                </p>


                <p class="destination-category">
                    ${category}
                </p>


                <p class="destination-rating">
                    ⭐ ${rating.toFixed(1)}
                </p>


                <a
                    href="place-details.html?place=${encodeURIComponent(slug)}"
                    class="card-button"
                >
                    View Details
                </a>

            </div>

        `;


        placeContainer.appendChild(card);

    });

}


// =====================================================
// PERSONALIZED FILTER
// =====================================================

function filterPersonalizedPlaces(places) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const state =
        params.get("state");


    const category =
        params.get("category");


    const budget =
        Number(
            params.get("budget")
        );


    const activity =
        params.get("activity");


    const season =
        params.get("season");


    return places.filter((place) => {


        const placeState =
            String(
                place.state || ""
            )
            .trim()
            .toLowerCase();


        const placeCategory =
            String(
                place.category || ""
            )
            .trim()
            .toLowerCase();


        const placeActivity =
            String(
                place.activity || ""
            )
            .trim()
            .toLowerCase();


        const placeSeason =
            String(
                place.season || ""
            )
            .trim()
            .toLowerCase();


        const placeBudget =
            Number(
                place.budget || 0
            );


        // STATE

        if (
            state &&
            placeState !==
            state.trim().toLowerCase()
        ) {

            return false;

        }


        // CATEGORY

        if (
            category &&
            placeCategory !==
            category.trim().toLowerCase()
        ) {

            return false;

        }


        // BUDGET

        if (
            budget > 0 &&
            placeBudget > budget
        ) {

            return false;

        }


        // ACTIVITY

        if (
            activity &&
            placeActivity &&
            !placeActivity.includes(
                activity.trim().toLowerCase()
            )
        ) {

            return false;

        }


        // SEASON

        if (
            season &&
            placeSeason &&
            !placeSeason.includes(
                season.trim().toLowerCase()
            )
        ) {

            return false;

        }


        return true;

    });

}


// =====================================================
// SEARCH FILTER
// =====================================================

function filterSearchPlaces(
    places,
    searchText
) {

    const search =
        searchText
            .trim()
            .toLowerCase();


    return places.filter((place) => {


        const name =
            String(
                place.name ||
                place.Name ||
                place.placeName ||
                ""
            )
            .toLowerCase();


        const city =
            String(
                place.city ||
                place.City ||
                ""
            )
            .toLowerCase();


        const state =
            String(
                place.state ||
                place.State ||
                ""
            )
            .toLowerCase();


        return (
            name.includes(search) ||
            city.includes(search) ||
            state.includes(search)
        );

    });

}


// =====================================================
// ACTIVE NAVIGATION
// =====================================================

function setActiveNavigation() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    const search =
        params.get("search");


    const personalized =
        params.get("personalized");


    const navLinks =
        document.querySelectorAll(
            ".category-bar a"
        );


    navLinks.forEach((link) => {

        link.classList.remove("active");

    });


    // Don't highlight category when searching

    if (search || personalized === "true") {

        return;

    }


    if (category) {

        navLinks.forEach((link) => {

            const linkUrl =
                new URL(
                    link.href,
                    window.location.href
                );


            const linkCategory =
                linkUrl.searchParams.get(
                    "category"
                );


            if (
                linkCategory &&
                linkCategory.toLowerCase() ===
                category.toLowerCase()
            ) {

                link.classList.add("active");

            }

        });


        return;

    }


    // DESTINATIONS ACTIVE

    navLinks.forEach((link) => {

        const linkUrl =
            new URL(
                link.href,
                window.location.href
            );


        const linkCategory =
            linkUrl.searchParams.get(
                "category"
            );


        const isRecommendations =
            linkUrl.pathname.endsWith(
                "/recommendations.html"
            );


        if (
            isRecommendations &&
            !linkCategory
        ) {

            link.classList.add("active");

        }

    });

}


// =====================================================
// LOAD PLACES
// =====================================================

async function loadAllPlaces() {

    try {

        const allPlaces =
            await getAllPlaces();


        const params =
            new URLSearchParams(
                window.location.search
            );


        const category =
            params.get("category");


        const search =
            params.get("search");


        const personalized =
            params.get("personalized");


        let places =
            allPlaces;


        // =================================================
        // SEARCH
        // =================================================

        if (search) {

            places =
                filterSearchPlaces(
                    allPlaces,
                    search
                );

        }


        // =================================================
        // CATEGORY
        // =================================================

        else if (
            category &&
            personalized !== "true"
        ) {

            places =
                allPlaces.filter(
                    (place) => {

                        const placeCategory =
                            String(
                                place.category ||
                                place.Category ||
                                ""
                            )
                            .trim()
                            .toLowerCase();


                        return (
                            placeCategory ===
                            category
                                .trim()
                                .toLowerCase()
                        );

                    }
                );

        }


        // =================================================
        // PERSONALIZED
        // =================================================

        else if (
            personalized === "true"
        ) {

            places =
                filterPersonalizedPlaces(
                    allPlaces
                );

        }


        // =================================================
        // DISPLAY
        // =================================================

        displayPlaces(places);


        // =================================================
        // ACTIVE NAVIGATION
        // =================================================

        setActiveNavigation();


    } catch (error) {

        console.error(
            "Error loading places:",
            error
        );


        placeContainer.innerHTML = `

            <p>
                Unable to load destinations.
            </p>

        `;

    }

}


// =====================================================
// START
// =====================================================

loadAllPlaces();