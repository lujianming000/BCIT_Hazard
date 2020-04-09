// ------------------------
// variables
// ------------------------

// Google Maps custom style
var customStyle = [{
    featureType: "poi",
    elementType: "labels",
    stylers: [{
        visibility: "off"
    }]
}];

// Hazard information (and Google Maps Markers)
var markers = [];
var uniqueId = 1;
var refId;
// information to collect from 'Report Hazard' modal form
var reportHazardType = document.getElementById("hazardType");
var reportHazardDescription = document.getElementById("hazardDescription");

// allows only one info window to be open at a time
var activeInfoWindow;

// initialized user from login
var user = {
    email: null,
    name: "anonymous user"
};

// report button
var isReportButtonClicked = false;




// ------------------------
// functions 
// ------------------------

/**
 * Initialize Google Maps.
 */
function initializeMap() {
    var BCIT = {
        lat: 49.2482,
        lng: -123
    };
    var BCIT_BOUNDS = {
        north: 49.255864,
        south: 49.241061,
        west: -123.004939,
        east: -122.995592
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        minZoom: 15.8,
        center: BCIT,
        fullscreenControl: false,
        restriction: {
            latLngBounds: BCIT_BOUNDS,
            strictBounds: false
        }
    });

    var bikePaths = [{
            lat: 49.254379443332255,
            lng: -123.00420298283386
        },
        {
            lat: 49.25179494593293,
            lng: -123.00413324539947
        },
        {
            lat: 49.25175993043178,
            lng: -122.99969150727081
        },
        {
            lat: 49.25179494593293,
            lng: -123.00413324539947
        },
        {
            lat: 49.247841007021364,
            lng: -123.00411715214538
        },
        {
            lat: 49.24588215594371,
            lng: -123.00293818296315
        },
        {
            lat: 49.243050272110736,
            lng: -123.00280823414612
        },
        {
            lat: 49.24167740274324,
            lng: -122.99817337696838
        },
        {
            lat: 49.25025593625811,
            lng: -122.99828254167252
        },
        {
            lat: 49.25181560977754,
            lng: -122.99530194592559
        },
        {
            lat: 49.254034441825574,
            lng: -122.99379933154079
        },
    ];

    var bikeRoute = new google.maps.Polyline({
        path: bikePaths,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });


    db.collection("hazards").onSnapshot(function (snapshot) {
        changes = snapshot.docChanges();
        changes.forEach(function (change) {
            if (change.type == "added") {
                console.log("New hazard: ", change.doc.id + " -> " + change.doc.data());
                addMarkerToMap(change.doc.id, change.doc.data(), map);
            }
            if (change.type == "modified") {
                console.log("Modified hazard: ", change.doc.id + " -> " + change.doc.data());
            }
            if (change.type == "removed") {
                console.log("Removed hazard: ", change.doc.id + " -> " + change.doc.data());
            }
        })
    })

    document.getElementById("report-btn").onclick = reportButtonClicked;
    document.getElementById("cancel-btn").onclick = cancelButtonClicked;

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function (event) {
        if (isReportButtonClicked) {
            //activate popup window // Get the modal: 'Report Hazard' pop-up window
            $("#reportHazardWindow").modal();

            // When the user cicks on 'Submit', make a new marker.
            $("#submitReport").click(function () {
                // create new hazard
                createHazard(event.latLng);

                //hide modal 
                $("#reportHazardWindow").modal("hide");
            });

            cancelButtonClicked();

        }
    });

    // invoke custom style onto map
    map.set("styles", customStyle)
    bikeRoute.setMap(map);
}

// add new hazard to firebase 'hazards' collection
function createHazard(location) {

    db.collection("hazards").add({
            sender: user.name,
            email: user.email,
            lat: location.lat(),
            lng: location.lng(),
            hazardType: reportHazardType.value,
            hazardDescription: reportHazardDescription.value,
            upvote: 0,
            downvote: 0
        })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.lerror("Error adding document: ", error);
        });
}

/**
 * Adds a marker using the information from the database to the map.
 * @param {string} docID document id of hazard from db
 * @param {object} info hazard from db to add to map
 * @param {object} map the map
 */
function addMarkerToMap(docID, info, map) {
    var marker = new google.maps.Marker({
        position: {
            lat: info.lat,
            lng: info.lng
        },
        map: map,

    });
    marker.setMap(map);

    //Set unique id
    marker.id = uniqueId;
    uniqueId++;
    markers.push(marker);


    google.maps.event.addListener(marker, "click", function (e) {
        openInfoWindow(docID, marker, map);
    });

}

/**
 * create and open a google maps info window to show hazard information
 * @param {string} docID document id of hazard from db
 * @param {object} marker google maps marker to open
 * @param {object} map the map
 */
function openInfoWindow(docID, marker, map) {
    if (activeInfoWindow) { activeInfoWindow.close();}

    var docRef = db.collection("hazards").doc(docID);

    docRef.get().then(function (doc) {
        var content = '<div id="iw-container">' +
            '<div class="iw-title">' +
            '<div><p>' + doc.data().hazardType + '</p></div>' +
            '<img class="sign" src="images/' + doc.data().hazardType + '.png">' +
            '</div>' +
            '<div class="iw-content">' +
            '<div class="iw-subTitle">' + doc.data().hazardType + '</div>' +
            '<p>' + doc.data().hazardDescription + '</p>' +
            '</div>' +
            '</div>' +
            '<div class="modal-footer" style="display: flex; justify-content: space-around;">' +
            // '<img id="upvoteSign' + docID + '" class="sign" src="images/upvote.png">' +
            '<img class="sign" src="images/upvote.png" onclick="upvoteHazard();">' +
            '<p id="upvote' + docID + '" style="font-size: 20px;  padding-right:10px;"> ' + doc.data().upvote + '</p>' +
            // '<img id="downvoteSign' + docID + '" class="sign" src="images/downvote.png">' +
            '<img class="sign" src="images/downvote.png" onclick="downvoteHazard();">' +
            '<p id="downvote' + docID + '" style="font-size: 20px;">' + doc.data().downvote + '</p>' +
            '</div>';
        
        // display 'Delete' button only if you are the user that created this hazard
        if (doc.data().email == user.email) {
            content +=
                '<div class="modal-footer" style="display:flex ; justify-content: space-around;">' +
                '<button type="button" class="btn btn-secondary" style="text-align:center;" onclick="deleteHazard(' +
                marker.id + ');">Delete</button>' +
                '</div>';
        }

        var infoWindow = new google.maps.InfoWindow({
            content: content,
            minWidth: 400
        });

        infoWindow.open(map, marker);

        refId = docID;
        activeInfoWindow = infoWindow;

    }). catch(function (error) {
        console.log("Error getting document:", error);
    })
}

/**
 * Initialize user to landing page.
 */
function initUser() {
    var myUserId = localStorage.getItem('myUserId');
    var docRef = db.collection("users").doc(myUserId);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            user.name = doc.data().name;
            user.email = doc.data().email;
            console.log("Document data: ", doc.data());
            // navbar - put a welcome greeting to user
            document.getElementById("welcomeUser").innerHTML = user.name;
        } else {
            console.log("No such document!");
            // navbar - put a welcome greeting to anonymous user
            document.getElementById("welcomeUser").innerHTML = user.name;
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

/**
 * 'Report' button is clicked to activate report feature.
 */
function reportButtonClicked() {
    isReportButtonClicked = true;
    document.getElementById("cancel-btn").style.display = "inline";
    document.getElementById("report-btn").style.display = "none";
}

/**
 * 'Report' button is clicked to deactivate report feature.
 */
function cancelButtonClicked() {
    isReportButtonClicked = false;
    document.getElementById("report-btn").style.display = "inline";
    document.getElementById("cancel-btn").style.display = "none";
}

/**
 * Upvote a hazard.
 * This happens when the 'upvote' sign on a hazard info window is clicked.
 */
function upvoteHazard() {
    firebase.auth().onAuthStateChanged(function () {
        var incByOne = firebase.firestore.FieldValue.increment(1);

        db.collection("hazards").doc(refId).update({
            upvote: incByOne
        })
    });
    var upvoteNum = parseInt(document.getElementById("upvote" + refId).innerHTML);
    upvoteNum++;
    document.getElementById("upvote" + refId).innerHTML = upvoteNum;
}

/**
 * Downvote a hazard.
 * This happens when the 'downvote' sign on a hazard info window is clicked.
 */
function downvoteHazard() {
    firebase.auth().onAuthStateChanged(function () {
        var incByOne = firebase.firestore.FieldValue.increment(1);

        db.collection("hazards").doc(refId).update({
            downvote: incByOne
        })
    });
    var downvoteNum = parseInt(document.getElementById("downvote" + refId).innerHTML);
    downvoteNum++;
    document.getElementById("downvote" + refId).innerHTML = downvoteNum;
}

/**
 * Find and remove the hazard from the map.
 * @param {number} id marker to delete
 */
function deleteHazard(id) {
    db.collection("hazards").doc(refId).delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });

    // remove the marker from map
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id == id) {
            markers[i].setMap(null);
            markers.splice(i, 1);
        }
    }
}