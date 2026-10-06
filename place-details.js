import { auth, db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


// =====================================================
// ALL TOURIST PLACES
// =====================================================

const places = {

    // 1. LONAVALA
    lonavala: {
        name: "Lonavala",
        location: "Maharashtra, India",
        rating: "4.6",

        image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",

        description: "Lonavala is a beautiful hill station in Maharashtra, famous for green valleys, waterfalls, mountains, lakes and scenic views. It is a popular destination for people travelling from Pune and Mumbai.",

        attractions: [
            "Bhushi Dam",
            "Tiger Point",
            "Lion's Point",
            "Lohagad Fort",
            "Karla Caves",
            "Pawna Lake"
        ],

        video: "https://www.youtube.com/embed/RbfABQk1IEU",

        map: "https://www.google.com/maps?q=Lonavala,Maharashtra&output=embed"
    },


    // 2. GOA
    goa: {
        name: "Goa",
        location: "Goa, India",
        rating: "4.7",

        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",

        description: "Goa is famous for its beautiful beaches, scenic views, Portuguese architecture, food and exciting tourist attractions.",

        attractions: [
            "Baga Beach",
            "Calangute Beach",
            "Fort Aguada",
            "Dudhsagar Falls",
            "Anjuna Beach",
            "Basilica of Bom Jesus"
        ],

        video: "https://www.youtube.com/embed/cXSC5sXIFgM",

        map: "https://www.google.com/maps?q=Goa,India&output=embed"
    },


    // 3. MAHABALESHWAR
    mahabaleshwar: {
        name: "Mahabaleshwar",
        location: "Maharashtra, India",
        rating: "4.6",

        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",

        description: "Mahabaleshwar is a beautiful hill station in Maharashtra known for its pleasant climate, green valleys, waterfalls, viewpoints and strawberry farms.",

        attractions: [
            "Venna Lake",
            "Arthur's Seat",
            "Mapro Garden",
            "Elephant's Head Point",
            "Pratapgad Fort",
            "Lingmala Waterfall"
        ],

        video: "",

        map: "https://www.google.com/maps?q=Mahabaleshwar,Maharashtra&output=embed"
    },


    // 4. MATHERAN
    matheran: {
        name: "Matheran",
        location: "Maharashtra, India",
        rating: "4.5",

        image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1200&q=80",

        description: "Matheran is a peaceful hill station in Maharashtra famous for its scenic viewpoints, green forests, pleasant weather and pollution-free environment.",

        attractions: [
            "Echo Point",
            "Panorama Point",
            "Louisa Point",
            "Charlotte Lake",
            "Monkey Point",
            "Matheran Toy Train"
        ],

        video: "https://www.youtube.com/embed/cWTdnR19fnk",

        map: "https://www.google.com/maps?q=Matheran,Maharashtra&output=embed"
    },


    // 5. AGRA
    agra: {
        name: "Agra",
        location: "Uttar Pradesh, India",
        rating: "4.5",

        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",

        description: "Agra is a famous historical city in Uttar Pradesh and is home to the Taj Mahal. It is known for its Mughal architecture, historical monuments and rich cultural heritage.",

        attractions: [
            "Taj Mahal",
            "Agra Fort",
            "Mehtab Bagh",
            "Itmad-ud-Daulah",
            "Akbar's Tomb",
            "Fatehpur Sikri"
        ],

        video: "https://www.youtube.com/embed/JHrZVpnARWw",

        map: "https://www.google.com/maps?q=Agra,Uttar+Pradesh&output=embed"
    },


    // 6. GIR
    gir: {
        name: "Gir",
        location: "Gujarat, India",
        rating: "4.6",

        image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80",

        description: "Gir is a famous wildlife destination in Gujarat and is known for the Asiatic lion. Gir National Park offers visitors an exciting opportunity to explore wildlife and natural surroundings.",

        attractions: [
            "Gir National Park",
            "Asiatic Lion Safari",
            "Kankai Mata Temple",
            "Kamleshwar Dam",
            "Devalia Safari Park",
            "Gir Interpretation Zone"
        ],

        video: "https://www.youtube.com/embed/YC9DeQNqIEk",

        map: "https://www.google.com/maps?q=Gir,Gujarat&output=embed"
    },


    // 7. LEH
    leh: {
        name: "Leh",
        location: "Ladakh, India",
        rating: "4.8",

        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",

        description: "Leh is a beautiful mountain destination in Ladakh famous for high-altitude landscapes, monasteries, lakes and breathtaking views.",

        attractions: [
            "Pangong Lake",
            "Nubra Valley",
            "Leh Palace",
            "Shanti Stupa",
            "Magnetic Hill",
            "Thiksey Monastery"
        ],

        video: "https://www.youtube.com/embed/Vy_THjN2W9o",

        map: "https://www.google.com/maps?q=Leh,Ladakh&output=embed"
    },


    // 8. MANALI
    manali: {
        name: "Manali",
        location: "Himachal Pradesh, India",
        rating: "4.8",

        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",

        description: "Manali is a beautiful mountain destination surrounded by snow-covered mountains, rivers and green valleys. It is famous for adventure activities, scenic views and peaceful surroundings.",

        attractions: [
            "Solang Valley",
            "Rohtang Pass",
            "Hadimba Temple",
            "Mall Road",
            "Manu Temple",
            "Old Manali"
        ],

        video: "https://www.youtube.com/embed/pUnKf-cG_WY",

        map: "https://www.google.com/maps?q=Manali,Himachal+Pradesh&output=embed"
    },


    // 9. TIRUPATI
    tirupati: {
        name: "Tirupati",
        location: "Andhra Pradesh, India",
        rating: "4.7",

        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",

        description: "Tirupati is one of the most important pilgrimage destinations in India. It is famous for the sacred Sri Venkateswara Temple located on the Tirumala hills.",

        attractions: [
            "Tirumala Venkateswara Temple",
            "Kapila Theertham",
            "Sri Govindaraja Swamy Temple",
            "Talakona Waterfall",
            "Akasa Ganga",
            "Silathoranam"
        ],

        video: "https://www.youtube.com/embed/jH8R0qarGMc",

        map: "https://www.google.com/maps?q=Tirupati,Andhra+Pradesh&output=embed"
    },


    // 10. VARANASI
    varanasi: {
        name: "Varanasi",
        location: "Uttar Pradesh, India",
        rating: "4.7",

        image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80",

        description: "Varanasi is one of India's oldest cities and is famous for sacred temples, the Ganges River, spiritual traditions and beautiful evening Ganga Aarti.",

        attractions: [
            "Kashi Vishwanath Temple",
            "Dashashwamedh Ghat",
            "Ganga Aarti",
            "Assi Ghat",
            "Sarnath",
            "Manikarnika Ghat"
        ],

        video: "https://www.youtube.com/embed/fG9SkhYU5KM",

        map: "https://www.google.com/maps?q=Varanasi,Uttar+Pradesh&output=embed"
    },


    // 11. ALIBAUG
    alibaug: {
        name: "Alibaug",
        location: "Maharashtra, India",
        rating: "4.5",

        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",

        description: "Alibaug is a beautiful coastal destination in Maharashtra known for beaches, forts, sea views and peaceful surroundings. It is a popular weekend destination from Mumbai and Pune.",

        attractions: [
            "Alibaug Beach",
            "Kolaba Fort",
            "Kashid Beach",
            "Nagaon Beach",
            "Korlai Fort",
            "Varsoli Beach"
        ],

        video: "https://www.youtube.com/embed/5opaIL1MXJI",

        map: "https://www.google.com/maps?q=Alibaug,Maharashtra&output=embed"
    },


    // 12. RAJASTHAN
    rajasthan: {
        name: "Rajasthan",
        location: "Rajasthan, India",
        rating: "4.6",

        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",

        description: "Rajasthan is a beautiful state famous for its royal palaces, magnificent forts, colorful culture, deserts and rich history. It is one of India's most popular destinations for exploring royal heritage and traditional culture.",

        attractions: [
            "Jaipur",
            "Udaipur",
            "Jaisalmer Fort",
            "Mehrangarh Fort",
            "Hawa Mahal",
            "Ranthambore National Park"
        ],

        video: "https://www.youtube.com/embed/RmxaeW-abNk",

        map: "https://www.google.com/maps?q=Rajasthan,India&output=embed"
    }

};


// =====================================================
// GET PLACE NAME FROM URL
// =====================================================

const urlParams = new URLSearchParams(window.location.search);

const placeName = (urlParams.get("place") || "")
    .trim()
    .toLowerCase();

const container = document.getElementById("placeDetails");


// =====================================================
// CHECK PLACE
// =====================================================

if (placeName && places[placeName]) {

    const place = places[placeName];


    // =================================================
    // CREATE ATTRACTIONS LIST
    // =================================================

    let attractionsHTML = "";

    place.attractions.forEach(function(item) {

        attractionsHTML += `
            <li>${item}</li>
        `;

    });


    // =================================================
    // CREATE VIDEO SECTION
    // =================================================

    let videoHTML = "";

    if (place.video) {

        videoHTML = `
            <h2>Explore ${place.name}</h2>

            <p class="video-text">
                Watch this travel video to explore
                ${place.name} before planning your trip.
            </p>

            <div class="place-video">

                <iframe
                    src="${place.video}"
                    title="${place.name} Travel Video"
                    allow="accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture;
                    web-share"
                    allowfullscreen>
                </iframe>

            </div>
        `;
    }


    // =================================================
    // CREATE MAP SECTION
    // =================================================

    let mapHTML = "";

    if (place.map) {

        mapHTML = `
            <h2>Location Map</h2>

            <p class="map-text">
                Find the exact location of ${place.name} on the map.
            </p>

            <div class="place-map">

                <iframe
                    src="${place.map}"
                    title="${place.name} Location Map"
                    loading="lazy"
                    allowfullscreen>
                </iframe>

            </div>
        `;
    }


    // =================================================
    // CREATE USER RATING SECTION
    // =================================================

    let ratingHTML = `

        <div class="user-rating-section">

            <h2>Rate This Place</h2>

            <p class="rating-text">
                How would you rate ${place.name}?
            </p>

            <div class="star-rating" id="starRating">

                <span class="rating-star" data-rating="1">☆</span>
                <span class="rating-star" data-rating="2">☆</span>
                <span class="rating-star" data-rating="3">☆</span>
                <span class="rating-star" data-rating="4">☆</span>
                <span class="rating-star" data-rating="5">☆</span>

            </div>

            <p id="ratingStatus" class="rating-status">
                Please select a rating.
            </p>

            <p id="averageRating" class="average-rating">
                Loading ratings...
            </p>

        </div>

    `;


    // =================================================
    // DISPLAY COMPLETE DETAILS
    // =================================================

    container.innerHTML = `

        <div class="details-card" style="margin: 0 auto; display: block;">

            <img
                src="${place.image}"
                alt="${place.name}"
                class="details-main-image"
            >


            <h1>${place.name}</h1>


            <p class="place-location">
                📍 ${place.location}
            </p>


            <p class="place-rating">
                ⭐ ${place.rating}
            </p>


            <h2>About ${place.name}</h2>

            <p class="place-description">
                ${place.description}
            </p>


            <h2>Popular Attractions</h2>

            <ul class="attractions-list">
                ${attractionsHTML}
            </ul>


            ${videoHTML}


            ${mapHTML}


            ${ratingHTML}


            <div class="details-buttons">

                <a
                    href="recommendations.html"
                    class="primary-btn"
                >
                    ← Back to Recommendations
                </a>


                <button
                    id="favouriteButton"
                    class="secondary-btn"
                    type="button"
                >
                    ❤️ Add to Favourite
                </button>

            </div>

        </div>

    `;


    // =================================================
    // GET RATING & FAVOURITE ELEMENTS
    // =================================================

    const stars =
        document.querySelectorAll(".rating-star");

    const ratingStatus =
        document.getElementById("ratingStatus");

    const averageRating =
        document.getElementById("averageRating");

    const starRating =
        document.getElementById("starRating");

    const favouriteButton =
        document.getElementById("favouriteButton");


    // =================================================
    // ADD TO FAVOURITE
    // =================================================

    // =================================================
    // ADD TO FAVOURITE
    // =================================================

    async function addToFavorites(place) {

        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert("Please login first to add this place to your favourite.");
            window.location.href = "favourite.html";
            return;
        }

        try {

            console.log("Current User UID:", currentUser.uid);
            console.log("Place:", place);
            console.log("Place Key:", placeName);

            const favoriteId = `${currentUser.uid}_${placeName}`;

            const favoriteRef = doc(
                db,
                "favorites",
                favoriteId
            );

            // Safe document existence check
            let favoriteDocExists = false;
            try {
                const favoriteDoc = await getDoc(favoriteRef);
                favoriteDocExists = favoriteDoc.exists();
            } catch (readErr) {
                // If reading non-existent doc throws a permission error under strict rules,
                // catch it and proceed with creating the doc.
                console.log("Checking favorite existence fallback:", readErr.code);
            }

            if (favoriteDocExists) {

                if (favouriteButton) {
                    favouriteButton.textContent = "❤️ Already in Favourite";
                }

                alert(
                    `${place.name} is already in your favourite.`
                );

                return;
            }

            const favoriteData = {

                userId: currentUser.uid,

                placeId: placeName,

                placeName: place.name || "Unknown",

                image: place.image || "",

                category: place.category || "Destination",

                city: place.city || "",

                state: place.state || "",

                rating: Number(place.rating || 0),

                budget: Number(place.budget || 0),

                savedAt: new Date()

            };

            console.log(
                "Saving favourite:",
                favoriteData
            );

            await setDoc(
                favoriteRef,
                favoriteData
            );

            if (favouriteButton) {
                favouriteButton.textContent = "❤️ Added to Favourite";
            }

            alert(
                `${place.name} has been added to your favourite!`
            );

        } catch (error) {

            console.error(
                "FULL ADD FAVOURITE ERROR:",
                error
            );

            alert(
                "Unable to add this place to favourite.\n\n" +
                error.code +
                "\n" +
                error.message
            );
        }
    }


    // =================================================
    // FAVOURITE BUTTON CLICK
    // =================================================

    if (favouriteButton) {

        favouriteButton.addEventListener(
            "click",
            function() {

                addToFavorites(place);

            }
        );

    }


    // =================================================
    // UPDATE STARS
    // =================================================

    function updateStars(selectedRating) {

        stars.forEach(function(star) {

            const starValue =
                Number(star.dataset.rating);

            if (starValue <= selectedRating) {

                star.textContent = "★";

            } else {

                star.textContent = "☆";

            }

        });

    }


    // =================================================
    // LOAD AVERAGE RATING
    // =================================================

    async function loadAverageRating() {

        try {

            const ratingsQuery = query(
                collection(db, "user_ratings"),
                where("placeId", "==", placeName)
            );

            const snapshot =
                await getDocs(ratingsQuery);


            if (snapshot.empty) {

                averageRating.innerHTML =
                    `⭐ ${place.rating} — Current Rating`;

                return;
            }


            let total = 0;


            snapshot.forEach(function(document) {

                const data = document.data();

                total += Number(data.rating || 0);

            });


            const average =
                (total / snapshot.size).toFixed(1);


            averageRating.innerHTML =
                `⭐ ${average} / 5 — ${snapshot.size} user rating${snapshot.size > 1 ? "s" : ""}`;


        } catch (error) {

            console.error(
                "Average rating error:",
                error
            );

            averageRating.innerHTML =
                `⭐ ${place.rating} — Current Rating`;

        }

    }


    // =================================================
    // LOAD CURRENT USER RATING
    // =================================================

    async function loadUserRating(user) {

        if (!user) {

            ratingStatus.innerHTML =
                "🔐 Please login to give your rating.";

            return;

        }


        try {

            const ratingId =
                `${placeName}_${user.uid}`;


            const ratingRef =
                doc(
                    db,
                    "user_ratings",
                    ratingId
                );


            const ratingDoc =
                await getDoc(ratingRef);


            if (ratingDoc.exists()) {

                const savedRating =
                    Number(
                        ratingDoc.data().rating
                    );


                updateStars(savedRating);


                ratingStatus.innerHTML =
                    `You rated this place ${savedRating} star${savedRating > 1 ? "s" : ""}. ⭐`;

            } else {

                ratingStatus.innerHTML =
                    "Select 1 to 5 stars to rate this place.";

            }


        } catch (error) {

            console.error(
                "User rating error:",
                error
            );

        }

    }


    // =================================================
    // SAVE USER RATING
    // =================================================

    async function saveRating(
        selectedRating,
        user
    ) {

        if (!user) {

            ratingStatus.innerHTML =
                "🔐 Please login first to give a rating.";

            return;

        }


        try {

            const ratingId =
                `${placeName}_${user.uid}`;


            const ratingRef =
                doc(
                    db,
                    "user_ratings",
                    ratingId
                );


            await setDoc(
                ratingRef,
                {

                    placeId: placeName,

                    placeName: place.name,

                    userId: user.uid,

                    rating: selectedRating,

                    updatedAt: new Date()

                }
            );


            updateStars(selectedRating);


            ratingStatus.innerHTML =
                `Thank you! You rated ${place.name} ${selectedRating} star${selectedRating > 1 ? "s" : ""}. ⭐`;


            loadAverageRating();


        } catch (error) {

            console.error(
                "Save rating error:",
                error
            );


            ratingStatus.innerHTML =
                "Unable to save rating. Please try again.";

        }

    }


    // =================================================
    // STAR CLICK
    // =================================================

    stars.forEach(function(star) {

        star.addEventListener(
            "click",
            function() {

                const selectedRating =
                    Number(this.dataset.rating);


                const currentUser =
                    auth.currentUser;


                saveRating(
                    selectedRating,
                    currentUser
                );

            }
        );


        // Hover effect
        star.addEventListener(
            "mouseenter",
            function() {

                const hoverRating =
                    Number(this.dataset.rating);


                stars.forEach(function(item) {

                    const value =
                        Number(item.dataset.rating);


                    if (value <= hoverRating) {

                        item.textContent = "★";

                    } else {

                        item.textContent = "☆";

                    }

                });

            }
        );

    });


    // =================================================
    // RESET STAR DISPLAY AFTER HOVER
    // =================================================

    starRating.addEventListener(
        "mouseleave",
        async function() {

            const currentUser =
                auth.currentUser;


            if (currentUser) {

                try {

                    const ratingId =
                        `${placeName}_${currentUser.uid}`;


                    const ratingRef =
                        doc(
                            db,
                            "user_ratings",
                            ratingId
                        );


                    const ratingDoc =
                        await getDoc(ratingRef);


                    if (ratingDoc.exists()) {

                        updateStars(
                            Number(
                                ratingDoc.data().rating
                            )
                        );

                    } else {

                        updateStars(0);

                    }

                } catch (error) {

                    updateStars(0);

                }

            } else {

                updateStars(0);

            }

        }
    );


    // =================================================
    // FIREBASE AUTH STATE
    // =================================================

    onAuthStateChanged(
        auth,
        function(user) {

            loadUserRating(user);

            loadAverageRating();

        }
    );


} else {

    // =================================================
    // PLACE NOT FOUND
    // =================================================

    container.innerHTML = `

        <div class="details-card">

            <h1>Place Not Found</h1>

            <p>
                Sorry, this tourist place could not be found.
            </p>

            <br>

            <a
                href="recommendations.html"
                class="primary-btn"
            >
                Go Back
            </a>

        </div>

    `;

}