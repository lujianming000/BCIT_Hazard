let upvotenumber = 0;
let downvotenumber = 0;
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

let reportButtonClicked = false;
let selectedlat;
let getid;

let user = {
    email: null,
    name: "anonymous user"
};

/**
 * Initialize Google Maps.
 */
function initialize() {
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
                        lat: parseFloat(doc.data().lat),
                        lng: parseFloat(doc.data().lng)
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

    document.getElementById("report-btn").onclick = reportClicked;

    //TEST CODE - NEW VARIABLE FOR SAVING DATA LAT AND LNG
    // var user = document.getElementById("welcomeUser").innerHTML;
    var testDataJASON = {
        sender: null,
        lat: null,
        lng: null
    };

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function (event) {
        reportHazard(event.latLng);

        markerlat = event.latLng.lat();
        markerlng = event.latLng.lng();

        localStorage.setItem('passinglat', markerlat);
        localStorage.setItem('passinglng', markerlng);

        //TEST CODE - NEW VARIABLE FOR SAVING DATA LAT AND LNG
        testDataJASON.sender = user.name;
        testDataJASON.lat = event.latLng.lat();
        testDataJASON.lng = event.latLng.lng();
        console.log(testDataJASON.sender);
        console.log(testDataJASON.lat);
        console.log(testDataJASON.lng);
    });
    map.set("styles", customStyle)
}

/**
 * 'Report' button is clicked.
 */
function reportClicked() {
    reportButtonClicked = true;
}

/**
 * Report a hazard.
 * @param {enum} location 
 */
function reportHazard(location) {
    if (reportButtonClicked) {
        window.location.assign("reportHazard.html");
        reportButtonClicked = false;
    }
}


/**
 * Adds a hazard to the map.
 * @param {*} location location of click
 * @param {*} map to add
 */
function addMarker(hazard, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var icon1 =
        'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    var marker = new google.maps.Marker({
        position: hazard.position,
        label: labels[labelIndex++ % labels.length],
        map: map,
        icon: icon1,

    });

    //activate popup window
    //$("#reportHazard").modal();

    /*$("#button1").click(function () {
        $("#reportHazard").modal("hide");
    });*/
    //window.open("reportHazard.html");

    reportButtonClicked = false;
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
            selectedlat = markers[i].getPosition().lat() + "";

            db.collection("hazards").where("lat", "==", selectedlat)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        getid = doc.id
                        console.log(doc.data().lat)
                        console.log(getid);
                        // doc.data().marker = false  not working
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
            // navbar - put a welcome greeting to user: user is anonymous
            document.getElementById("welcomeUser").innerHTML = user.name;
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

/**
 * Upvote a hazard.
 */
function upvotefun() {
    upvotenumber += 1;
    document.getElementById("upvote").innerHTML = upvotenumber;
};

/**
 * Downvote a hazard.
 */
function downvotefun() {
    downvotenumber += 1;
    document.getElementById("downvote").innerHTML = downvotenumber;
};