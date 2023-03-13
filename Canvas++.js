/* Main Javascript File for Canvas++
Description: This main file is where we will import functions from our 3 other .js files
for each module, and attach those functions to the document aka extension.
In other words, we will only be calling functions from our extension interface in this
file, the 3 other .js files will only hold the functions to be called.
*/

// IMPORTS
import {login, getCourseIDs} from "./login.js"
import {getAssignments, loadCourseAssignments} from "./assignments.js"
import {getNotifications, loadCourseNotifications} from "./notifications.js"
import {getGrades, loadCourseGrades, updateTotalGrade} from "./grade_calculator.js"


/// SETUP AND MANAGE GLOBAL VARIABLES

// important url that will prepend an
// "Access-Control-Allow-Origin" onto the CANVAS API response's header
// See: https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
const cors_url = "https://cors-anywhere.herokuapp.com/";
// specify the host url
const base_url = "https://canvas.instructure.com/api/v1";
// header(s)
//const header = {"Authorization" : "Bearer " + access_token};
// complete URL for API call request
const global_url = cors_url + base_url;

const not_url = cors_url + "https://canvas.instructure.com:443/api/v1";

let global_options = {
    method: 'GET',
};

/* Access Token Stuff */
//Get data from chrome extensions local storage
let storageCache = { count: 0, course_ids: 0, token: 0};
let global_token = storageCache.token;


// Asynchronously retrieve data from storage.local, then cache it.
// We do this once here at the beginning of the script to retrieve
// values, such as the users Canvas API access token, from the extension's
// storage from previous sessions, if any exists.
const initStorageCache = await chrome.storage.local.get().then((items) => {
    // Copy the data retrieved from storage into storageCache.
    Object.assign(storageCache, items);

    //TESTING
    console.log("TEST: in initStorageCache - count is : " + storageCache.count +
        " and token is: " + storageCache.token + " and courseIDs are: " + storageCache.course_ids);
    // Reassign the storageCache actual token value to our global_token
    global_token = storageCache.token;
});

// Below updates storageCache, which holds each session's values
// for use in our functions, whenever we modify chrome storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            `Old value was "${oldValue}", new value is "${newValue}".`
        );
    }
    chrome.storage.local.get().then((items) => {
        // Copy the data retrieved from storage into storageCache.
        console.log("Console logging chrome storage items in Canvas++.js upon storage change.");
        console.log(items);
        Object.assign(storageCache, items);
    });
});

// SUBMIT AND SAVE TOKEN TO CHROME STORAGE (IN LOGIN TAB)
/* NOTE: Below function is weird to have in main .js file, but necessary since
our main .js file needs to have a global access token for usage in imported functions
Save canvas access token to chrome extension on click of "submit" button */
document.getElementById("submit-token").onclick = (async () => {
    console.log("TEST: the set count function ran")
    try {
        await initStorageCache;
    } catch (e) {
        // Handle error that occurred during storage initialization.
        console.log(e);
    }

    // Get the canvas token from the submit token form
    let access_token = document.getElementById("canvas-token").value;
    console.log("TEST - in submit_token onclick: the token is " + access_token);
    storageCache.token = access_token;

    // // Normal action handler logic.
    storageCache.count++;
    chrome.storage.local.set(storageCache);
    global_token = access_token;
});


// CANVAS++ INTERFACE FUNCTIONALITY
// This is where we attach functions to our interface (document)

/* TAB AND TABS' DISPLAYS MANAGEMENT */

const numTabs = 3;

// Declare tab button variables
for (var i = 1; i <= numTabs; i++) {
    document.getElementById("tab" + i).addEventListener("click", handleTabClick(i));
}

// Handle click on tab buttons
function handleTabClick(tabID) {
    return function() {
        showTab(tabID);
    }
}


/* Function to hide or show one tab display at a time based on tab clicked. */
function showTab(currentTab) {
    for (var i = 1; i <= numTabs; i++) {
        var tab = document.getElementById("tab" + i);
        var tab_window = document.getElementById("tab_window" + i);

        if (i == currentTab) {
            tab.classList.add("selected");
            tab_window.style.display = "block";
        }
        else {
            tab.classList.remove("selected");
            tab_window.style.display = "none";
        }
    }
}


/* LOGIN - Use the access key to authorize your CANVAS API requests. Here's an example: */
const login_output_box = document.getElementById("test-api-output");
document.getElementById("login-button").addEventListener("click", async() => {
    loadCanvasExtension();    // Move to after login
    let login_output = await login(global_url, global_options, global_token);
    login_output_box.innerHTML = login_output;
    let course_id_map = await getCourseIDs(login_output);

    for (let [key, value] of course_id_map) {
        //console.log(key + ": " + value + "\n");
        login_output_box.innerHTML += key + ": " + value + "\n";
    }

    loadCanvasExtension();

    try {
        await initStorageCache;
        //loadCanvasExtension();  // Does it go here?
    } catch (e) {
        // Handle error that occurred during storage initialization.
        console.log(e);
    }

    var map_obj = Object.fromEntries(course_id_map);
    storageCache.course_ids = JSON.stringify(map_obj);
    console.log("Logging storageCache in Canvas++.js after login() call, below should have courseIDs");
    console.log(storageCache);
    chrome.storage.local.set(storageCache).then(async () => {
        console.log("Value is set to " + JSON.stringify(storageCache));
    });
});


/* ASSIGNMENTS - */
const assignments_output_box = document.getElementById("test-assignments-output");/*
document.getElementById("assignments-button").addEventListener("click", async() => {
    let storageCache = await chrome.storage.local.get();
    let course_ids_string = storageCache.course_ids;
    console.log("TEST: logging course ids from within assignments-button js");
    console.log(storageCache);
    console.log(course_ids_string);
    let course_ids_map = new Map(Object.entries(JSON.parse(course_ids_string)));
    for (var [key, course_id] of course_ids_map){
        console.log("In Canvas++.js - assignments button for loop.");
        console.log("calling getAssignments for course name:" + key + " and id: " + course_id);
        let ass_output = await getAssignments(global_url, global_options, global_token, course_id);
        assignments_output_box.innerHTML += ass_output + "\n";
    }
});*/


/* NOTIFICATIONS - */
const notifications_output_box = document.getElementById("test-notifications-output"); /*
document.getElementById("notifications-button").addEventListener("click", async() => {
    let storageCache = await chrome.storage.local.get();
    let course_ids_string = storageCache.course_ids;
    console.log("TEST: logging course ids from within notifcations-button js");
    console.log(storageCache);
    console.log(course_ids_string);
    let course_ids_map = new Map(Object.entries(JSON.parse(course_ids_string)));
    for (var [key, course_id] of course_ids_map){
        console.log("In Canvas++.js - notifications button for loop.");
        console.log("calling getNotifications for course name:" + key + " and id: " + course_id);
        let not_output = await getNotifications(global_url, global_options, global_token, course_id);
        notifications_output_box.innerHTML += not_output + "\n";
    }
}*/


/* GRADE CALCULATOR - */
const grade_calculator_output_box = document.getElementById("test-grades-output");/*
document.getElementById("grades-button").addEventListener("click", async() => {
    // storageCache has our info that is stored in chrome.local.storage
    //let storageCache = await chrome.storage.local.get();
    let grades_output = await getGrades(global_url, global_options, global_token);
    grade_calculator_output_box.innerHTML += grades_output + "\n";
    /*
    let course_ids_string = storageCache.course_ids;
    console.log("TEST: logging course ids from within notifcations-button js");
    console.log(storageCache);
    console.log(course_ids_string);
    let course_ids_map = new Map(Object.entries(JSON.parse(course_ids_string)));
    for (var [key, course_id] of course_ids_map){
        console.log("In Canvas++.js - notifications button for loop.");
        console.log("calling getNotifications for course name:" + key + " and id: " + course_id);
        let not_output = await getGrades(global_url, global_options, global_token);
        notifications_output_box.innerHTML += not_output + "\n";
    }
}); */


// Stores the data fetched from Canvas
var courses = {};

// The id of the course curtrently being viewed
var currentCourse = null;

// All courses
var courses = {
    "AAA": { name: "AAA", id: 0 },
    "BBB": { name: "BBB", id: 1 },
    "CCC": { name: "CCC", id: 2 },
    "DDD": { name: "DDD", id: 3 }
};

// All assignments
var assignments = {
    "AAA": { name: "AAA", list: ["a", "b", "c", "d"] },
    "BBB": { name: "BBB", list: ["E", "F", "G"] },
    "CCC": { name: "CCC", list: ["1", "2", "6", "4"] },
    "DDD": { name: "DDD", list: ["one"] }
};

var notifications = {
    "AAA": { name: "AAA", list: ["default text", "badfhdfgnaretjnadg"] },
    "BBB": { name: "BBB", list: ["none"] },
    "CCC": { name: "CCC", list: ["filler filler", "loren epsom", "filler filler"] },
    "DDD": { name: "DDD", list: ["one"] }
};

var grades = {
    "AAA": { name: "AAA", list: [
        {name: "a", score: 0.935, max: 1, weight: 0.2},
        {name: "b", score: 9.29, max: 10, weight: 0.4},
        {name: "c", score: 10, max: 10, weight: 0.3},
        {name: "d", score: 0.9626, max: 1, weight: 0.1}
    ] },
    "BBB": { name: "BBB", list: [
        {name: "E", score: 0.928, max: 1, weight: 0.3},
        {name: "F", score: 1.8, max: 2, weight: 0.4},
        {name: "G", score: 0.8392, max: 1, weight: 0.3}
    ] },
    "CCC": { name: "CCC", list: [
        {name: "1", score: 2, max: 2, weight: 0.1},
        {name: "2", score: 1.01, max: 1, weight: 0.1},
        {name: "6", score: 2.928, max: 3, weight: 0.3},
        {name: "4", score: 0.8908, max: 1, weight: 0.5}
    ] },
    "DDD": { name: "DDD", list: [
        {name: "one", score: 0.827, max: 1, weight: 1},
    ] }
};


function loadCanvasExtension() {
    document.getElementById("authed").style.display = "block";
    document.getElementById("login").style.display = "none";

    // Add the assignments and notifications for each course
    for (var courseKey in courses) {
        var course = courses[courseKey];
        //assignments[courseKey] = getAssignments(global_url, global_options, global_token);
        //notifications[courseKey] = getNotifications(global_url, global_options, global_token);
    }

    showTab(1);
    loadAllCourses();
}


function loadAllCourses() {
    var list = "<p>- Courses -</p>";

    // Create list
    for (var courseKey in courses) {
        var course = courses[courseKey];

        // Create div element with click handler
        var div = document.createElement("div");
        div.setAttribute("id", "course" + courseKey);
        div.setAttribute("class", "course");
        div.textContent = course.name;

        // Add div element to list
        list += div.outerHTML;
    }

    // Add list to document
    document.getElementById("course_list").innerHTML = list;

    // Call loadCourse function with index as argument
    var first = true;
    for (var courseKey in courses) {
        document.getElementById("course" + courseKey).addEventListener("click", handleCourseClick(courseKey));

        // Load first course
        if (first) {
            first = false;
            loadCourse(courseKey);
        }
    }
}


// Handle click on course buttons
function handleCourseClick(courseKey) {
    return function() {
        loadCourse(courseKey);
    }
}


function loadCourse(courseKey) {

    // Visually show selcted
    for (var key in courses) {
        document.getElementById("course" + key).classList.remove("selected");
    }
    var courseButton = document.getElementById("course" + courseKey);
    courseButton.classList.add("selected");

    // Update course code labels
    var a_Label = document.getElementById("a_Label")
    if (a_Label) a_Label.innerHTML = "- " + courseKey + " Assignments -";
    var n_Label = document.getElementById("n_Label")
    if (n_Label) n_Label.innerHTML = "- " + courseKey + " Notifications -";

    // Update course code label for grade calc via this function
    if (document.getElementById("g_Label") &&
    document.getElementById("grade_perc_" + courseKey + 0)) {
        updateTotalGrade(courseKey, grades[courseKey]);
    }

    // Render appropriate data to each tab
    loadCourseAssignments(courseKey, assignments[courseKey]);
    loadCourseNotifications(courseKey, notifications[courseKey]);
    loadCourseGrades(courseKey, grades[courseKey]);
}


// LOGIN USES THIS FUNCTION AFTER SIGN-IN
export {loadCanvasExtension};
