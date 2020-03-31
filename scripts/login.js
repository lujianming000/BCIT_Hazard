// variable initialization - default style for google maps
var customStyle = [{
    featureType: "poi",
    elementType: "labels",
    stylers: [{
        visibility: "off"
    }]
}];

/**
 * Initialize the Google Maps background.
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

    map.set("styles", customStyle)
}

/**
 * Login with Firebase by using the FirebaseUI Widget.
 */
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            //------------------------------------------------------------------------------------------
            // The code below is modified from default snippet provided by the FB documentation.
            //
            // If the user is a "brand new" user, then create a new "user" in your own database.
            // Assign this user with the name and email provided.
            // Before this works, you must enable "Firestore" from the firebase console.
            // The Firestore rules must allow the user to write. 
            //------------------------------------------------------------------------------------------
            var user = authResult.user;
            if (authResult.additionalUserInfo.isNewUser) {
                db.collection("users").doc(user.uid).set({
                        name: user.displayName,
                        email: user.email
                    }).then(function () {
                        console.log("New user added to firestore");
                        window.location.assign("map.html");
                    })
                    .catch(function (error) {
                        console.log("Error adding new user: " + error);
                    });
            } else {
                return true;
            }
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('login').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'map.html',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: 'map.html',
    // Privacy policy url.
    privacyPolicyUrl: 'map.html',
    accountChooserEnabled: false
};