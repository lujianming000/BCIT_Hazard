function writeReport() {
    document.getElementById("reportHazard").addEventListener("submit", function (e) {
        e.preventDefault();
        let hT = document.getElementById("hazardType").value;
        let hD = document.getElementById("hazardDescription").value;
        db.collection("hazards").add({
            hazardType: hT,
            hazardDescription: hD,
            hazardUser: "John Doe",
            position: currentClickPosition
        }).then(function () {
            window.location.assign("map.html");
        })
    })
}

function showHazards() {
    db.collection("hazards").onSnapshot(function (snapshot) {
        changes = snapshot.docChanges();
        changes.forEach(function (change) {
            if (change.type == "added") {
                console.log(change.doc.data());
                //addMarker(change, map);
            }

        })
    })
}

function addHazardToMap(hazard) {

    let marker = new google.map.Marker({position: hazard.position, map: map})
    markers.push(marker);


    document.getElementById("type").innerHtml = hazard.HazardType;
    document.getElementById("description").innerHtml = hazard.HazardDescription;
    document.getElementById("user").innerHtml = hazard.HazardUser;

}
showHazards();
writeReport();