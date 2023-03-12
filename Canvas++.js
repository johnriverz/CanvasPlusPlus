/* Main Javascript File for Canvas++
Description: This main file is where we will import functions from our 3 other .js files
for each module, and attach those functions to the document aka extension.
In other words, we will only be calling functions from our extension interface in this
file, the 3 other .js files will only hold the functions to be called. 
*/


// IMPORTS
import {login, getCourseIDs} from "./login.js"
import {getAssignments} from "./assignments.js"
import {getNotifications} from "./notifications.js"


// SETUP AND MANAGE GLOBAL VARIABLES

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


// Initialize variables needed to access Canvas API via HTML requests

// CANVAS++ INTERFACE FUNCTIONALITY
// This is where we attach functions to our interface (document)

/* TAB AND TABS' DISPLAYS MANAGEMENT */

// Declare tab button variables
document.getElementById("assignments-tab-btn").onclick = function() {showTab(1)};
document.getElementById("notifications-tab-btn").onclick = function() {showTab(2)};
document.getElementById("grade-calc-tab-btn").onclick = function() {showTab(3)};
document.getElementById("access-token-tab-btn").onclick = function() {showTab(4)};


/* Function to hide or show one tab display at a time based on tab clicked. */
function showTab(tabNum) {
    for (var i = 1; i <= 4; i++) {
        if (i == tabNum)
            document.getElementById("tab" + i).style.display = "block";
        else
            document.getElementById("tab" + i).style.display = "none";
    }
}


/* LOGIN - Use the access key to authorize your CANVAS API requests. Here's an example: */
const login_output_box = document.getElementById("test-api-output");
document.getElementById("login-button").addEventListener("click", async() => {
    let login_output = await login(global_url, global_options, global_token);
    login_output_box.innerHTML = login_output;
    let course_id_map = await getCourseIDs(login_output);

    for (let [key, value] of course_id_map) {
        //console.log(key + ": " + value + "\n");
        login_output_box.innerHTML += key + ": " + value + "\n";
    }

    try {
        await initStorageCache;
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
const assignments_output_box = document.getElementById("test-assignments-output");
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
});

/* NOTIFICATIONS - */
const notifications_output_box = document.getElementById("test-notifications-output");
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
});