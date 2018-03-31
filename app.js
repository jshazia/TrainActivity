
var config = {
    apiKey: "AIzaSyAx_2Jz_ts_PpW2T8uiTCgR5t6X70X859U",
    authDomain: "traintimesactivity.firebaseapp.com",
    databaseURL: "https://traintimesactivity.firebaseio.com",
    projectId: "traintimesactivity",
    storageBucket: "traintimesactivity.appspot.com",
    messagingSenderId: "1082397629238"
};
firebase.initializeApp(config);

var database = firebase.database();


$("#submit").on("click", function (event) {

    // prevent page from refreshing when form tries to submit itself

    event.preventDefault();

    // Capture user inputs and store them into variables
    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var trainTime = $("#trainTime").val().trim();
    var frequency = $("#frequency").val().trim();
    var trains = new Array ();

    database.ref().on("value", function(snapshot) {
        console.log(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    // Console log each of the user inputs to confirm we are receiving them
    console.log(name);
    console.log(destination);
    console.log(trainTime);
    console.log(frequency);
    console.log(trains);

    database.ref().push({
        name: name,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency
    });
    database.ref().limitToLast(1).on("child_added", function(snapshot){
        console.log(snapshot.val());
        if (snapshot.child("name").exists() &&
            snapshot.child("destination").exists() &&
            snapshot.child("trainTime").exists() &&
            snapshot.child("frequency").exists())
        {

            var obj = {
                name: snapshot.val().name,
                destination: snapshot.val().destination,
                trainTime: snapshot.val().trainTime,
                frequency: snapshot.val().frequency
            };
            trains.push(obj);
            console.log(trains);
            console.log(moment(trainTime).startOf('hour').fromNow())
        }
    });
    for (var i= 0; i < trains.length; i++){

        console.log(trains[i]);

        $("tbody").append("<td>" + trains[i].name + "</td>");
        $("tbody").append("<td>" + trains[i].destination + "</td>");
        $("tbody").append("<td>" + trains[i].frequency + "</td>");
        $("tbody").append("<td>" + trains[i].trainTime + "</td>");
    };

    function updatedTime (){


    }
});




