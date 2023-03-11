/* Main Javascript File for Canvas++
Description: This main file is where we will import functions from our 3 other .js files
for each module, and attach those functions to the document aka extension.
In other words, we will only be calling functions from our extension interface in this
file, the 3 other .js files will only hold the functions to be called. 
*/

// IMPORTS
import {login} from "./login.js"
import {getAssignments, getCourseIDs} from "./assignments.js"

// SETUP MAIN VARIABLES

// SETUP MAIN VARIABLES - Access Token Stuff 
//Get data from chrome extensions local storage
let storageCache = { count: 0, token: 0};
let global_token = storageCache.token;
// Asynchronously retrieve data from storage.local, then cache it.
async function initStorageCache(){ 
    chrome.storage.local.get().then((items) => {
        // Copy the data retrieved from storage into storageCache.
        Object.assign(storageCache, items);
        
        //TESTING
        console.log("TEST: in get() - count is : " + storageCache.count + 
        " and token is: " + storageCache.token);
        // Reassign the storageCache actual token value to our global_token
        global_token = storageCache.token;
        return 1; // return 1 to indicate success
    });
}




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
 //const header = {"Authorization" : "Bearer " + access_token};
 const global_options = {
     method: 'GET'
 };
 // complete URL for API call request
 const global_url = cors_url + base_url;


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


/* LOGIN TAB SECTION - Use the access key to authorize your CANVAS API requests. Here's an example: */
const login_output_box = document.getElementById("test-api-output");
document.getElementById("login-button").addEventListener("click", async() => {
     try {
        let success = await initStorageCache();
    } catch (e) {
        // Handle error that occurred during storage initialization.
        console.log(e);
    }
    let login_output = await login(global_url, global_options, global_token);
    login_output_box.innerHTML = login_output;
    let course_id_map = await getCourseIDs(login_output);
    storageCache.course_ids = course_id_map;
    chrome.storage.local.set(storageCache);
});

/* NOTE: Below function is weird to have in main .js file, but necessary since  
our main .js file needs to have a global access token for usage in imported functions
Save canvas access token to chrome extension on click of "submit" button */
document.getElementById("submit-token").onclick = (async () => {
    console.log("TEST: the set count function ran")
    try {
        let success = await initStorageCache();
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
});


/* ASSIGNMENTS - Use the access key to authorize your CANVAS API requests. Here's an example: */
const assignments_output_box = document.getElementById("test-api-output");
document.getElementById("assignments-button").addEventListener("click", async() => {
    // var global_url, global_options, global_access = initCall(global_token);
    let success = await initStorageCache();
    let course_id_map = await chrome.storage.local.get().then((items) => {return items.course_ids;});
    console.log("TEST: logging course ids from within assignments-button js");
    console.log(course_id_map);
    assignments_output_box.innerHTML = await getAssignments(global_url, global_options, global_token);
});