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


/* 
LOGIN WITH CANVAS API ACCESS KEY AND STORE IT IN CHROME EXTENSION
reference - background.js example on this page:
https://developer.chrome.com/docs/extensions/reference/storage/
 */

// Get data from chrome extensions local storage
const storageCache = { count: 0, token: 0};

// Asynchronously retrieve data from storage.local, then cache it.
const initStorageCache = chrome.storage.local.get().then((items) => {
    // Copy the data retrieved from storage into storageCache.
    Object.assign(storageCache, items);
    
    //TESTING
    console.log("TEST: in get() - count is : " + storageCache.count + 
    " and token is: " + storageCache.token);
});


/* Save canvas access token to chrome extension on click of "submit" button */
document.getElementById("submit-token").onclick = (async () => {
    console.log("TEST: the set count function ran")
    try {
        await initStorageCache;
    } catch (e) {
        // Handle error that occurred during storage initialization.
        console.log(e);
    }

    // Get the canvas token from the submit token form
    token = document.getElementById("canvas-token").value;
    console.log("TEST: the token is " + token);
    storageCache.token = token;

    // // Normal action handler logic.
    // storageCache.count++;
    chrome.storage.local.set(storageCache);
});


/* LOGIN - Use the access key to authorize your CANVAS API requests. Here's an example: */
document.getElementById("login-button").onclick = (async () => {
    console.log("TEST: the login button click function ran");
    try {
        await initStorageCache;
    } catch (e) {
        // Handle error that occurred during validation of token.
        // Handle error that occurred during storage initialization.
        console.log("An error arose during the chrome storage initialization.");
        console.log(e);
    }

    // Get the canvas token from the user
    token = storageCache.token;

    // idk
    //initCall(token, getActiveCourses);
    // initCall(token, printDashboard);
    initCall(token, getCourseIDs);
})


// initializes variables needed to access Canvas API via HTML requests
function initCall(token, funcCall) {
    // validates calls to Canvas API for user's data
    access_token = "access_token=" + token;
    
    // important url that will prepend an
    // "Access-Control-Allow-Origin" onto the CANVAS API response's header
    // See: https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
    cors_url = "https://cors-anywhere.herokuapp.com/";

    // specify the host url
    base_url = "https://canvas.instructure.com/api/v1";

    // header(s)
    header = {"Authorization" : "Bearer " + access_token};

    options = {
        method: 'GET'
    };

    // complete URL for API call request
    post_url = cors_url + base_url;

    // run inputted function with correct paramaters
    funcCall(post_url, options, access_token);
}


async function getActiveCourses(postUrl, header, token) {
    url = postUrl + "/courses?enrollment_state=active&" + token;
    try {
        const response = await fetch(url, header);
        return response.json();
    } catch(e) {
        console.log(e);
    }
}


function getAssignments(postUrl, header, token) {
    url = postUrl + "/courses" + token;
    //console.log(url);
    var obj;

    try {
        fetch(url, header)
            .then(response => response.text()) // Read the response as text
            .then(html => {
                //alert("Here's the response from the CANVAS API: " + html);
                obj = JSON.parse(html);
                for(let i = 0; i < obj.length; i++) {
                    console.log(obj[i]);
                }
            })
            .catch(e => {
                console.log(e)
            })
    } catch(e) {
        console.log(e)
    }
}


function getCourseIDs(postUrl, header, token) {
    getActiveCourses(postUrl, header, token).then((courses) => {
            console.log("TEST - testing getCourseIDs(), here we log courses w/in it: ");
            console.log(courses);
    });
}


function dashboard(postUrl, header, token) {
    url = postUrl + "/dashboard/dashboard_cards" + token;

    try {
        fetch(url, header)
            .then(response => response.text()) // Read the response as text
            .then(html => alert(html))
    } catch(e) {
        console.log(e)
    }
}