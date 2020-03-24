function writeReport(){
    document.getElementById("reportHazard").addEventListener("submit", function(e){

        e.preventDefault();
        let hT = document.getElementById("hazardType").value;
        let hD = document.getElementById("hazardDescription").value;
        let hP = document.getElementById("photoInput").value;
        db.collection("hazards").add({
            HazardType:hT,
            HazardDescription:hD,
            HazardUser:"John Doe",
            Position:[100,100]
        })
    })
}
function showHazards(){
    db.collection("hazards").onSnapshot(function(snapshot){
        changes = snapshot.docChanges();
        changes.forEach(function(change){
            if(change.type == "added"){
                console.log(change.doc);
            }
            
        })
    })
}

function addHazardToMap(hazard){
    document.getElementById("type").innerHtml=hazard.HazardType;
    document.getElementById("description").innerHtml=hazard.HazardDescription;
    document.getElementById("user").innerHtml=hazard.HazardUser;
    document.getElementById("longitude").innerHtml=hazard.Position[0];
    document.getElementById("latitude").innerHtml=hazard.Position[1];

}
showHazards();
writeReport();