let upvotenumber = 0;
let downvotenumber = 0;
// In the following example, markers appear when the user clicks on the map.
// Each marker is labeled with a single alphabetical character.
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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

    document.getElementById("report-btn").onclick = reportClicked;

    // This event listener calls addMarker() when the map is clicked.
    google.maps.event.addListener(map, 'click', function (event) {
        addMarker(event.latLng, map);
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
 * Adds a hazard to the map.
 * @param {*} location location of click
 * @param {*} map to add
 */
function addMarker(location, map) {
    if (!reportButtonClicked) {
        return
    }


    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var icon1 =
        'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map,
        icon: icon1,

    });

    //activate popup window
    $("#reporthazard").modal();

    $("#button1").click(function () {
        $("#reporthazard").modal("hide");
    });


    //Attach click event handler to the marker.
    google.maps.event.addListener(marker, "click", function (e) {
        var content = '<div id="iw-container">' +
            '<div class="iw-title">' +
            '<div><p>Hazard Descriptions</p></div>' +
            '<img class="sign" src="images/snow.png">' +
            '</div>' +
            '<div class="iw-content">' +
            '<div class="iw-subTitle">Jimmy Reports</div>' +
            '<p>Snow develops in clouds that themselves are part of a larger weather system. The physics of snow crystal development in clouds results from a complex set of variables that include moisture content and temperatures. The resulting shapes of the falling and fallen crystals can be classified into a number of basic shapes and combinations, thereof. Occasionally, some plate-like, dendritic and stellar-shaped snowflakes can form under clear sky with a very cold temperature inversion present.</p>' +
            '<div class="iw-subTitle">More Reports</div>' +
            '<br>Snow develops in clouds that themselves are part of a larger weather system. The physics of snow crystal development in clouds results from a complex set of variables that include moisture content and temperatures. The resulting shapes of the falling and fallen crystals can be classified into a number of basic shapes and combinations, thereof. Occasionally, some plate-like, dendritic and stellar-shaped snowflakes can form under clear sky with a very cold temperature inversion present.</p>' +
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

    //Set unique id
    marker.id = uniqueId;
    uniqueId++;
    markers.push(marker);

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

            //Remove the marker from array.
            markers.splice(i, 1);

            return;
        }
    }
};

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

//OLD LOGIN FUNCTION
        //activate login window
        // $("#loginwindow").modal();

        // $("#button2").click(function () {
        //     $("#loginwindow").modal("hide");
        // });
        //activate login window