import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const form =
    document.getElementById("placeForm");

const list =
    document.getElementById("adminPlaceList");

const count =
    document.getElementById("adminPlaceCount");

const message =
    document.getElementById("adminMessage");

const editId =
    document.getElementById("editPlaceId");

const cancelEdit =
    document.getElementById("cancelEdit");

const formTitle =
    document.getElementById("adminFormTitle");


let places = [];


/* --------------------------------
   ADMIN CHECK
--------------------------------- */

onAuthStateChanged(
    auth,
    async function(user) {

        if (!user) {

            window.location.href =
                "login.html";

            return;

        }


        try {

            const userDocument =
                await getDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    )
                );


            if (
                !userDocument.exists()
                ||
                userDocument.data().role !== "admin"
            ) {

                alert(
                    "Access denied. Admin only."
                );

                window.location.href =
                    "dashboard.html";

                return;

            }


            loadPlaces();


        } catch (error) {

            console.error(error);

            window.location.href =
                "dashboard.html";

        }

    }
);


/* --------------------------------
   LOAD PLACES
--------------------------------- */

async function loadPlaces() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "tourist_places"
                )
            );


        places =
            snapshot.docs.map(
                function(document) {

                    return {

                        id: document.id,

                        ...document.data()

                    };

                }
            );


        count.textContent =
            places.length;


        renderPlaces();


    } catch (error) {

        console.error(error);

        list.innerHTML =
            "Unable to load places.";

    }

}


/* --------------------------------
   RENDER
--------------------------------- */

function renderPlaces() {

    if (places.length === 0) {

        list.innerHTML = `

            <div class="empty-box">

                <h3>
                    No tourist places
                </h3>

                <p>
                    Add your first destination.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML =
        places.map(
            function(place) {

                return `

                    <div class="admin-place-item">

                        <div>

                            <h3>
                                ${place.name}
                            </h3>

                            <p>
                                ${place.city},
                                ${place.state}
                            </p>

                            <span>
                                ${place.category}
                                ·
                                ★ ${place.rating || 0}
                            </span>

                        </div>


                        <div class="admin-actions">

                            <button
                                class="edit-button"
                                onclick="editPlace('${place.id}')"
                            >
                                Edit
                            </button>

                            <button
                                class="delete-button"
                                onclick="deletePlace('${place.id}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* --------------------------------
   ADD / UPDATE
--------------------------------- */

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const data = {

            name:
                document.getElementById(
                    "placeName"
                ).value.trim(),

            state:
                document.getElementById(
                    "placeState"
                ).value.trim(),

            city:
                document.getElementById(
                    "placeCity"
                ).value.trim(),

            category:
                document.getElementById(
                    "placeCategory"
                ).value,

            budget:
                Number(
                    document.getElementById(
                        "placeBudget"
                    ).value
                ),

            activities:
                document.getElementById(
                    "placeActivities"
                ).value.trim(),

            bestSeason:
                document.getElementById(
                    "placeSeason"
                ).value.trim(),

            rating:
                Number(
                    document.getElementById(
                        "placeRating"
                    ).value
                ),

            image:
                document.getElementById(
                    "placeImage"
                ).value.trim(),

            videoUrl:
                document.getElementById(
                    "placeVideo"
                ).value.trim(),

            mapQuery:
                document.getElementById(
                    "placeMapQuery"
                ).value.trim(),

            description:
                document.getElementById(
                    "placeDescription"
                ).value.trim(),

            updatedAt:
                new Date()

        };


        try {

            if (editId.value) {

                await updateDoc(
                    doc(
                        db,
                        "tourist_places",
                        editId.value
                    ),
                    data
                );


                message.textContent =
                    "Place updated successfully.";

            } else {

                data.createdAt =
                    new Date();


                await addDoc(
                    collection(
                        db,
                        "tourist_places"
                    ),
                    data
                );


                message.textContent =
                    "Place added successfully.";

            }


            resetForm();

            await loadPlaces();


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to save place.";

        }

    }
);


/* --------------------------------
   EDIT
--------------------------------- */

window.editPlace =
function(placeId) {

    const place =
        places.find(
            item => item.id === placeId
        );


    if (!place) {
        return;
    }


    editId.value =
        place.id;


    document.getElementById(
        "placeName"
    ).value =
        place.name || "";


    document.getElementById(
        "placeState"
    ).value =
        place.state || "";


    document.getElementById(
        "placeCity"
    ).value =
        place.city || "";


    document.getElementById(
        "placeCategory"
    ).value =
        place.category || "";


    document.getElementById(
        "placeBudget"
    ).value =
        place.budget || "";


    document.getElementById(
        "placeActivities"
    ).value =
        place.activities || "";


    document.getElementById(
        "placeSeason"
    ).value =
        place.bestSeason || "";


    document.getElementById(
        "placeRating"
    ).value =
        place.rating || "";


    document.getElementById(
        "placeImage"
    ).value =
        place.image || "";


    document.getElementById(
        "placeVideo"
    ).value =
        place.videoUrl || "";


    document.getElementById(
        "placeMapQuery"
    ).value =
        place.mapQuery || "";


    document.getElementById(
        "placeDescription"
    ).value =
        place.description || "";


    formTitle.textContent =
        "Edit Tourist Place";


    cancelEdit.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

};


/* --------------------------------
   DELETE
--------------------------------- */

window.deletePlace =
async function(placeId) {

    const confirmed =
        confirm(
            "Delete this tourist place?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "tourist_places",
                placeId
            )
        );


        await loadPlaces();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete place."
        );

    }

};


/* --------------------------------
   RESET
--------------------------------- */

function resetForm() {

    form.reset();

    editId.value = "";

    formTitle.textContent =
        "Add New Tourist Place";

    cancelEdit.classList.add(
        "hidden"
    );

}


cancelEdit.addEventListener(
    "click",
    resetForm
);