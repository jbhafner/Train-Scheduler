/* global firebase moment */

$(document).ready(function(){
  console.log("page ready");
})

// 1. Initialize Firebase

  var config = {
    apiKey: "AIzaSyBPtOWepaVeCaj4NgV-JqAziUKEtpi734M",
    authDomain: "train-schedule-cba95.firebaseapp.com",
    databaseURL: "https://train-schedule-cba95.firebaseio.com",
    projectId: "train-schedule-cba95",
    storageBucket: "",
    messagingSenderId: "794239992082"
  };
  firebase.initializeApp(config);

var database = firebase.database();
console.log("db ready");
console.log(database);

// 2. Button for adding Employees
$("#add-train-button").on("click", function(event) {
  // $(document).on("click", "#add-train-btn", function(event){
  event.preventDefault();

  console.log ("submit button clicked");

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#dest-input").val().trim();
  var firstTrain = $("#first-train-time-input").val().trim();
  var frequency = $("#freq-input").val().trim();
  var nextArrival = moment().add(frequency,'minutes').format("HH:mm");
  var minutesAway = moment(nextArrival, "HH:mm").subtract(frequency,'minutes').format("mm");

  // var empStart = moment($("#start-input").val().trim(), "DD/MM/YY").format("X");

  // Creates local "temporary" object for holding train data
  var newTrain = {
    train: trainName,
    dest: destination,
    first: firstTrain,
    freq: frequency,
    next: nextArrival,
    minAway: minutesAway
  };

  console.log(newTrain);

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log("newTrain.train "+newTrain.train);
  console.log(newTrain.dest);
  console.log(newTrain.first);
  console.log(newTrain.freq);

  // Alert
  alert("New Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#first-train-time-input").val("");
  $("#freq-input").val("");
});

// // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  $("#schedule-head").text("Local Train Schedule (" + moment().format("HH:mm") + ")");
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().train;
  var destination = childSnapshot.val().dest;
  var firstTrain = childSnapshot.val().first;
  var frequency = childSnapshot.val().freq;

  // Train Info
  console.log("train name: " + trainName + " // destination: " + destination + 
    " // first train  "+ firstTrain + " // frequency: " + frequency);
  console.log("current time: " + moment() + "// first train time: " + moment(firstTrain,"HH:mm").unix());
  console.log("current time: " + moment().format("HH:mm") + " || diff between now and next train: " + 
    moment().diff(moment(firstTrain,"HH:mm"),"minutes"));

//   // Prettify the employee start
  var firstTrainPretty = moment(firstTrain, 'HH:mm').format("HH:mm");
  console.log("first train pretty " + firstTrainPretty);

  // Calculate time difference between first train and now in minutes
  var diffTime = moment().diff(moment(firstTrain,"HH:mm"),"minutes");
  console.log("diffTime: " + diffTime);

  // time remainder -- calculate the remainder in minutes of [(current time-now) / frequency]
  var remainder = diffTime % frequency;
  console.log("remainder: "+ remainder);

  // caclulate time until next train (frequency-remainder)
  var minTilNextTrain = frequency-remainder;
  console.log("minTilNextTrain: " + minTilNextTrain);

//   // Calculate the next train arrival
//   var empMonths = moment().diff(moment.unix(empStart, "X"), "months");
  var nextArrival = moment().add(minTilNextTrain,'minutes').format("HH:mm");
  console.log("next arrival " + nextArrival);

//   // Add each train's data into the table
  $("#train-schedule-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  firstTrainPretty + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minTilNextTrain + "</td></tr>");
});

// Listing for language button english / japanese
$(document).on("click", "#englishLangBtn", function(){
  $('[data-eng]').each(function(){
  $(this).text($(this).data('eng'));
  })
});

$(document).on("click", "#japaneseLangBtn", function(){
  $('[data-jpn]').each(function(){
    $(this).text($(this).data('jpn'));
  })
});