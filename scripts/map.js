
// In the following example, markers appear when the user clicks on the map.
var markerlat;
var markerlng;

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


    db.collection("hazards").where("marker", "==", true)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
            

                var marker = new google.maps.Marker({
                    position: {
                        lat: doc.data().lat,
                        lng: doc.data().lng
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
                        '<div class="iw-subTitle">' + doc.data().hazardType + '</div>' +
                        '<p>' + doc.data().hazardDescription + '</p>' +
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
            });
        })

    document.getElementById("report-btn").onclick = reportButtonClicked;

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function (event) {
        // ~~~~~~~~~~~~~~
        // ~~ OLD CODE ~~
        // ~~~~~~~~~~~~~~

        // mapClicked(event.latLng, map); // old test

        // markerlat = event.latLng.lat();
        // markerlng = event.latLng.lng();

        // localStorage.setItem('passinglat', markerlat);
        // localStorage.setItem('passinglng', markerlng);

        // ~~~~~~~~~~~~~~
        // ~~ NEW CODE ~~
        // ~~~~~~~~~~~~~~
        if (isReportButtonClicked) {
            console.log("line 125 called: new portion of code");

            //activate popup window // Get the modal: 'Report Hazard' pop-up window
            $("#reportHazardWindow").modal();

            // When the user cicks on 'Submit', make a new marker.
            $("#submitReport").click(function () {
                console.log("submit button clicked");

                // create new hazard
                createHazard(event.latLng);

                //hide modal 
                $("#reportHazardWindow").modal("hide");

                // location.reload();
            });

            isReportButtonClicked = false;
        }

    });

    // invoke custom style onto map
    map.set("styles", customStyle)
}

// add new hazard to firebase 'hazards' collection
function createHazard(location) {
    console.log("reached createHazard");
    db.collection("hazards").add({
        sender: user.name,
        email: user.email,
        lat: location.lat(),
        lng: location.lng(),
        hazardType: reportHazardType.value,
        hazardDescription: reportHazardDescription.value,
        upvote: 0,
        downvote: 0,
        marker: true
    });
    console.log("finished createHazard");
}

// OLD - SHOULD NO LONGER NEED
/**
 * Report a hazard.
 * @param {enum} location 
 */
function mapClicked(location, map) {
    if (isReportButtonClicked) {
        // window.location.assign("reportHazard.html"); //-> scriptReportHazard.js

        console.log("mapClicked called"); // test
        addMarker(location, map); // try: report to database with modal
    }
}


// /**
//  * Adds a hazard to the map.
//  * @param {*} location location of click
//  * @param {*} map to add
//  */
// function addMarker(hazard, map) {
//     // Add the marker at the clicked location, and add the next-available label
//     // from the array of alphabetical characters.
//     // var icon1 =
//     //     'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
//     //  var   marker = new google.maps.Marker({
//     //     position: hazard.position,
//     //     // label: labels[labelIndex++ % labels.length],
//     //     map: map,
//     //     icon: icon1,

//     // });

//     //activate popup window // Get the modal: 'Report Hazard' pop-up window
//     $("#reportHazardWindow").modal();

//     // When the user cicks on 'Submit', make a new marker.
//     $("#testReport").click(function () {
//         console.log("submit button clicked");
//         // $("#reportHazardWindow").modal("hide"); //old
//         let reportHazardType = document.getElementById("hazardType");
//         let reportHazardDescription = document.getElementById("hazardDescription");
//         console.log(reportHazardType.value);
//         console.log(reportHazardDescription.value);
//     });

//     // window.open("reportHazard.html"); //-> scriptReportHazard.js

//     isReportButtonClicked = false;
// }

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