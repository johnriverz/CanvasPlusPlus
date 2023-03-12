/* Main Javascript File for Canvas++
Description: This main file is where we will import functions from our 3 other .js files
for each module, and attach those functions to the document aka extension.
In other words, we will only be calling functions from our extension interface in this
file, the 3 other .js files will only hold the functions to be called.
*/

// IMPORTS
import {login} from "./login.js"
import {getAssignments, loadCourseAssignments} from "./assignments.js"
import {getNotifications, loadCourseNotifications} from "./notifications.js"
import {getGrades, loadCourseGrades} from "./grade_calculator.js"


// SETUP MAIN VARIABLES - Create global API Call variables with initCall

// SETUP MAIN VARIABLES - Initialize variables needed to access Canvas API via HTML requests

// validates calls to Canvas API for user's data
//const global_access = "access_token=" + global_token;
// important url that will prepend an
// "Access-Control-Allow-Origin" onto the CANVAS API response's header
// See: https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
const cors_url = "https://cors-anywhere.herokuapp.com/";
// specify the host url
const base_url = "https://canvas.instructure.com/api/v1";
// header(s)
var header = {};
const global_options = {
   method: 'GET'
};
// complete URL for API call request
const global_url = cors_url + base_url;


// SETUP MAIN VARIABLES - Access Token Stuff
//Get data from chrome extensions local storage
let storageCache = { count: 0, token: 0};
let global_token = storageCache.token;

// Asynchronously retrieve data from storage.local, then cache it.
const initStorageCache = chrome.storage.local.get().then((items) => {
    // Copy the data retrieved from storage into storageCache.
    Object.assign(storageCache, items);

    //TESTING
    console.log("TEST: in get() - count is : " + storageCache.count +
    " and token is: " + storageCache.token);
    // Reassign the storageCache actual token value to our global_token
    global_token = storageCache.token;
});



/* NOTE: Below function is weird to have in main .js file, but necessary since
our main .js file needs to have a global access token for usage in imported functions
Save canvas access token to chrome extension on click of "submit" button */

// SETUP MAIN VARIABLES - Create global API Call variables with initCall
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
    // storageCache.count++;
    chrome.storage.local.set(storageCache);
    global_token = access_token;
    header = {"Authorization" : "Bearer " + global_token};

    await login(global_url, header, global_token);
    //loadCanvasExtension()
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


// Stores the data fetched from Canvas
var courses = {};

// The id of the course curtrently being viewed
var currentCourse = null;

// All courses
var courses = {
    "A": { name: "AAA", id: 0 },
    "B": { name: "BBB", id: 1 },
    "C": { name: "CCC", id: 2 },
    "D": { name: "DDD", id: 3 }
};

// All assignments
var assignments = {
    "A": { name: "AAA", list: ["a", "b", "c", "d"] },
    "B": { name: "BBB", list: ["E", "F", "G"] },
    "C": { name: "CCC", list: ["1", "2", "6", "4"] },
    "D": { name: "DDD", list: ["one"] }
};

var notifications = {
    "A": { name: "AAA", list: ["default text", "badfhdfgnaretjnadg"] },
    "B": { name: "BBB", list: ["none"] },
    "C": { name: "CCC", list: ["filler filler", "loren epsom", "filler filler"] },
    "D": { name: "DDD", list: ["one"] }
};

var grades = {
    "A": { name: "AAA", list: [
        {name: "a", score: 0.935, max: 1, weight: 0.2},
        {name: "b", score: 0.929, max: 1, weight: 0.4},
        {name: "c", score: 1, max: 1, weight: 0.3},
        {name: "d", score: 0.9626, max: 1, weight: 0.1}
    ] },
    "B": { name: "BBB", list: [
        {name: "E", score: 0.928, max: 1, weight: 0.3},
        {name: "F", score: 0.8, max: 1, weight: 0.4},
        {name: "G", score: 0.8392, max: 1, weight: 0.3}
    ] },
    "C": { name: "CCC", list: [
        {name: "1", score: 1, max: 1, weight: 0.1},
        {name: "2", score: 1.01, max: 1, weight: 0.1},
        {name: "6", score: 0.928, max: 1, weight: 0.3},
        {name: "4", score: 0.8908, max: 1, weight: 0.5}
    ] },
    "D": { name: "DDD", list: [
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
    console.log(courseButton)

    // Update course code labels
    var a_Label = document.getElementById("a_Label")
    if (a_Label) a_Label.innerHTML = "- " + courseKey + " Assignments -";
    var n_Label = document.getElementById("n_Label")
    if (n_Label) n_Label.innerHTML = "- " + courseKey + " Notifications -";
    var n_Label = document.getElementById("g_Label")
    if (n_Label) g_Label.innerHTML = "- " + courseKey + " Grade Calculator -";

    // Render appropriate data to each tab
    loadCourseAssignments(courseKey, assignments[courseKey]);
    loadCourseNotifications(courseKey, notifications[courseKey]);
    loadCourseGrades(courseKey, grades[courseKey]);
}


// LOGIN USES THIS FUNCTION AFTER SIGN-IN
export {loadCanvasExtension};
