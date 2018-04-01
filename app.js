
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

var trainCounter = 0;

$("#submit").on("click", function (event) {

    // prevent page from refreshing when form tries to submit itself

    event.preventDefault();

    // Capture user inputs and store them into variables
    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var trainTime = $("#trainTime").val().trim();
    var frequency = $("#frequency").val().trim();
    var trains = new Array ();
    frequency = parseInt(frequency);

    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log("TIME CONVERTED: " + firstTimeConverted);

    var diffTime = moment.duration(moment().diff(moment(trainTime, "HH:mm")),
        'milliseconds').asMinutes();
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var timeRemaining = frequency - (Math.floor(diffTime) % frequency);
    console.log(timeRemaining);

    var nextTrain = diffTime > 0 ? moment().add(timeRemaining, 'minutes' ) : moment(trainTime, "HH:mm") ;
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

    var minTilTrain = Math.ceil(moment.duration(moment(nextTrain).diff(moment()), 'milliseconds').asMinutes());
    console.log("MINUTES TILL TRAIN: " + minTilTrain);


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
        }
    });

        var row = $('<tr>');

        var trainName = $('<td>');
        trainName.text(name);
        row.append(trainName);

        var trainPlace = $('<td>');
        trainPlace.text(destination);
        row.append(trainPlace);

        var trainFreq = $('<td>');
        trainFreq.text(frequency);
        row.append(trainFreq);

        var timing = $('<td>');
        timing.text(moment(nextTrain).format("HH:mm"));
        row.append(timing);

        var minutesUntilNext = $('<td>');
        minutesUntilNext.text(minTilTrain);
        row.append(minutesUntilNext);

      var trainLocalStorage = row.prop('outerHTML');
    console.log(trainLocalStorage);
    localStorage.setItem("data-train-" + trainCounter, trainLocalStorage);

        name = $('#name').val("");
        destination = $('#destination').val("");
        trainTime = $('#trainTime').val("");
        frequency = $('#frequency').val("");

    $('tbody').append(trainLocalStorage);
    trainCounter++;

    return false;

});

$(document).ready(function() {

    for (var i = 0; i < localStorage.length; i++) {
        $('tbody').append(localStorage.getItem("data-train-" + trainCounter));
        trainCounter++;

    }
});








