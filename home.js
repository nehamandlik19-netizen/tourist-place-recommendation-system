import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// =====================================================
// POPULAR CONTAINER
// =====================================================

const popularContainer =
    document.getElementById("popularContainer");


// =====================================================
// GLOBAL SEARCH
// =====================================================

const searchForm =
    document.getElementById("globalSearchForm");

const searchInput =
    document.getElementById("globalSearch");


// =====================================================
// PLACE IMAGES
// =====================================================

const placeImages = {

    Lonavala:
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=900&q=80",

    Goa:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",

    Mahabaleshwar:
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80",

    Matheran:
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=900&q=80",

    Agra:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80",

    Gir:
        "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=900&q=80",

    Leh:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",

    Manali:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",

    Tirupati:
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",

    Varanasi:
        "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=900&q=80",

    Alibaug:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",

    Rajasthan:
        "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=80",

    Jaipur:
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80"

};


// =====================================================
// DEFAULT IMAGE
// =====================================================

const defaultImage =
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";


// =====================================================
// GET IMAGE
// =====================================================

function getImage(place) {

    const name =
        String(place.name || "").trim();


    if (
        place.image &&
        typeof place.image === "string" &&
        place.image.trim() !== ""
    ) {

        return place.image;

    }


    if (placeImages[name]) {

        return placeImages[name];

    }


    return defaultImage;
}


// =====================================================
// CREATE CARD
// =====================================================

function createCard(place) {

    const name =
        place.name || "Unknown Place";


    const rating =
        Number(place.rating || 0).toFixed(1);


    const category =
        place.category || "Destination";


    const city =
        place.city || "";


    const state =
        place.state || "";


    const location =
        [city, state]
            .filter(Boolean)
            .join(", ");


    const placeKey =
        String(name)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");


    return `

        <article class="destination-card">

            <div class="destination-image">

                <img
                    src="${getImage(place)}"
                    alt="${name}"
                    loading="lazy"
                >

                <span class="destination-badge">
                    ${category}
                </span>

            </div>


            <div class="destination-content">

                <div class="rating">
                    ★ ${rating}
                </div>


                <h3>
                    ${name}
                </h3>


                <p class="location">
                    📍 ${location || "India"}
                </p>


                <p class="budget">
                    From ₹${Number(place.budget || 0).toLocaleString("en-IN")}
                </p>


                <a
                    href="pages/place-details.html?place=${encodeURIComponent(placeKey)}"
                    class="card-button"
                >
                    View Details
                </a>

            </div>

        </article>

    `;

}


// =====================================================
// LOAD POPULAR PLACES
// =====================================================

async function loadPopularPlaces() {

    if (!popularContainer) {

        return;

    }


    try {

        const placesRef =
            collection(
                db,
                "tourist_places"
            );


        const snapshot =
            await getDocs(
                placesRef
            );


        if (snapshot.empty) {

            popularContainer.innerHTML = `
                <p>No places found in database.</p>
            `;

            return;

        }


        let places =
            snapshot.docs.map(
                function(document) {

                    return {

                        id: document.id,

                        ...document.data()

                    };

                }
            );


        // Highest rating first

        places.sort(
            function(a, b) {

                return (
                    Number(b.rating || 0)
                    -
                    Number(a.rating || 0)
                );

            }
        );


        // =====================================================
        // SHOW 6 PLACES ON HOME
        // =====================================================

        places =
            places.slice(0, 6);


        popularContainer.innerHTML =
            places
                .map(createCard)
                .join("");


    } catch (error) {

        console.error(
            "HOME FIRESTORE ERROR:",
            error
        );


        popularContainer.innerHTML = `

            <div class="home-loading">

                <p>
                    Unable to load destinations.
                </p>

                <small>
                    ${error.message}
                </small>

            </div>

        `;

    }

}


// =====================================================
// SEARCH PLACES
// =====================================================

if (searchForm && searchInput) {

    searchForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const searchText =
                searchInput.value.trim();


            if (!searchText) {

                return;

            }


            window.location.href =
                "pages/recommendations.html?search=" +
                encodeURIComponent(searchText);

        }
    );

}


// =====================================================
// START
// =====================================================

loadPopularPlaces();