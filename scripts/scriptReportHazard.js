function writeReport(){
    document.getElementById("reportHazard").addEventListener("submit", function(e){

        e.preventDefault();
        let hT = document.getElementById("hazardType").value;
        let hD = document.getElementById("hazardDescription").value;
        let hP = document.getElementById("photoInput").value;
        db.collection("hazards").add({
            HazardType:hT,
            HazardDescription:hD,
            HazardPhoto:hP,
            Longitude:100,
            Latitude:100
        })
    })
}
writeReport();