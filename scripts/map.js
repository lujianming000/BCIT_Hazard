// In the following example, markers appear when the user clicks on the map.
var markerLat;
var markerLng;
var markerType;
var markerDescription;

var labelIndex = 0;
var customStyle = [{
    featureType: "poi",
    elementType: "labels",
    stylers: [{
        visibility: "off"
    }]
}];

var markers = [];
var uniqueId = 1;

let isReportButtonClicked = false;

let selectedlat;
let getid;

let user = {
    email: null,
    name: "anonymous user"
};

// variables - 'Report Hazard' information
let reportHazardType = document.getElementById("hazardType");
let reportHazardDescription = document.getElementById("hazardDescription");

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
        restriction: {
            latLngBounds: BCIT_BOUNDS,
            strictBounds: false
        }
    });

    var BikePath = [
        {lat: 49.254379443332255, lng: -123.00420298283386},
        {lat: 49.25179494593293, lng: -123.00413324539947},
        {lat: 49.25175993043178, lng: -122.99969150727081},
        {lat: 49.25179494593293, lng: -123.00413324539947},
        {lat: 49.247841007021364, lng: -123.00411715214538},
        {lat: 49.24588215594371, lng: -123.00293818296315},
        {lat: 49.243050272110736, lng: -123.00280823414612},
        {lat: 49.24167740274324, lng: -122.99817337696838},
        {lat: 49.25025593625811, lng: -122.99828254167252},
        {lat: 49.25181560977754, lng: -122.99530194592559},
        {lat: 49.254034441825574, lng: -122.99379933154079},
      ];

    var BikeRoute = new google.maps.Polyline({
        path: BikePath,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

    BikeRoute.setMap(map);

    db.collection("hazards").where("marker", "==", true)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                markerLat = doc.data().lat;
                markerLng = doc.data().lng;
                markerType = doc.data().hazardType;
                markerDescription = doc.data().hazardDescription;

                addMarkerToMap(map);
            });
        })

    document.getElementById("report-btn").onclick = reportButtonClicked;

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function (event) {
        if (isReportButtonClicked) {
            //activate popup window // Get the modal: 'Report Hazard' pop-up window
            $("#reportHazardWindow").modal();

            // When the user cicks on 'Submit', make a new marker.
            $("#submitReport").click(function () {
                // create new hazard
                createHazard(event.latLng, map);

                //hide modal 
                $("#reportHazardWindow").modal("hide");
            });

            isReportButtonClicked = false;
        }
    });

    // invoke custom style onto map
    map.set("styles", customStyle)
}

// add new hazard to firebase 'hazards' collection
function createHazard(location, map) {
    markerLat = location.lat();
    markerLng = location.lng();
    markerType = reportHazardType.value;
    markerDescription = reportHazardDescription.value;

    db.collection("hazards").add({
        sender: user.name,
        email: user.email,
        lat: markerLat,
        lng: markerLng,
        hazardType: markerType,
        hazardDescription: markerDescription,
        upvote: 0,
        downvote: 0,
        marker: true
    });

    addMarkerToMap(map);
}

function addMarkerToMap(map) {
    var marker = new google.maps.Marker({
        position: {
            lat: markerLat,
            lng: markerLng
        },
        map: map,
    });
    marker.setMap(map);

    //Set unique id
    marker.id = uniqueId;
    uniqueId++;
    markers.push(marker);


    google.maps.event.addListener(marker, "click", function (e) {
        
        var content = '<div id="iw-container">' +
            '<div class="iw-title">' +
            '<div><p>Hazard</p></div>' +
            '<img class="sign" src="images/snow.png">' +
            '</div>' +
            '<div class="iw-content">' +
            '<div class="iw-subTitle">' + markerType + '</div>' +
            '<p>' + markerDescription + '</p>' +
            '</div>' +
            '</div>' +
            '<div class="modal-footer" style="display:flex ; justify-content: space-around;" >' +
            '<img class="sign" src="images/upvote.png" onclick="upvotefun();">' +
            '<p id="upvote" style="font-size: 20px; padding-left:10px;">0</p>' +
            '<img class="sign" src="images/downvote.png" onclick="downvotefun();">' +
            '<p id="downvote" style="font-size: 20px;  padding-left:10px;">0</p>' +
            '</div>';
        content +=
            '<div class="modal-footer" style="display:flex ; justify-content: space-around;" >' +
            "<button type = 'button' class='btn btn-secondary' style='text-align:center;' value = 'Delete' onclick = 'DeleteMarker(" +
            marker.id +
            ");'>Delete</button>" +
            '</div>';

        var InfoWindow = new google.maps.InfoWindow({
            content: content,
            maxWidth: 350
        });
        InfoWindow.open(map, marker);

    });
}

/**
 * Find and remove the hazard from the map.
 * @param {number} id to delete
 */
function DeleteMarker(id) {
    //Find and remove the marker from the Array
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id == id) {
            //Remove the marker from Map                 
            markers[i].setMap(null);
            selectedlat = markers[i].getPosition().lat();

            db.collection("hazards").where("lat", "==", selectedlat)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {

                        db.collection("hazards").doc(doc.id).update({
                            marker: false
                        });

                    });
                })

            //Remove the marker from array.
            markers.splice(i, 1);

            return;
        }
    }
};

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
 * 'Report' button is clicked.
 */
function reportButtonClicked() {
    isReportButtonClicked = true;

    // TRYING: SWITCH BUTTON PURPOSE ('Report'/'Cancel Report')

    // console.log("before:", isReportButtonClicked);
    // isReportButtonClicked = !isReportButtonClicked; // true becomes false, false becomes true;
    // console.log("after:", isReportButtonClicked);
    // if (isReportButtonClicked) {
    //     document.getElementById("report-btn").innerHTML = "Cancel Report";
    // } else {
    //     document.getElementById("report-btn").innerHTML = "Report";
    // }
}

/**
 * Upvote a hazard.
 */
function upvotefun() {
    let upvotenumber = doc.data().upvote;
    upvotenumber++;
    db.collection("hazards").doc(doc.id).update({
        upvote: upvotenumber,
        downvote: downvotenumber
    });
    document.getElementById("upvote").innerHTML = doc.data().upvote;
};

/**
 * Downvote a hazard.
 */
function downvotefun() {
    let downvotenumber = doc.data().downvote;
    downvotenumber++;
    db.collection("hazards").doc(doc.id).update({
        upvote: upvotenumber,
        downvote: downvotenumber
    });   
    document.getElementById("downvote").innerHTML = doc.data().downvote;
};