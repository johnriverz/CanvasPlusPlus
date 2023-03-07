
// TAB AND TABS' DISPLAYS MANAGEMENT

// Declare tab button variables
document.getElementById("assignments-tab-btn").onclick = function() {showTab(1)};
document.getElementById("notifications-tab-btn").onclick = function() {showTab(2)};
document.getElementById("grade-calc-tab-btn").onclick = function() {showTab(3)};
document.getElementById("access-token-tab-btn").onclick = function() {showTab(4)};

// Function to hide or show one tab display at a time based on tab clicked
function showTab(tabNum) {
    for (var i = 1; i <= 4; i++) {
        if (i == tabNum)
            document.getElementById("tab" + i).style.display = "block";
        else
            document.getElementById("tab" + i).style.display = "none";
    }
}

// LOGIN WITH CANVAS API ACCESS KEY AND STORE IT IN CHROME EXTENSION
// reference - background.js example on this page:
// https://developer.chrome.com/docs/extensions/reference/storage/

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


// Save canvas access token to chrome extension on click of "submit" button
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
    // Normal action handler logic.
    storageCache.count++;
    chrome.storage.local.set(storageCache);

});

// LOGIN - Use the access key to authorize your CANVAS API requests. Here's an example
document.getElementById("login-button").onclick = (async () => {
    console.log("TEST: the login button click function ran");
    try {
        await initStorageCache;
    } catch (e) {
        // Handle error that occurred during storage initialization.
        console.log("An error arose during the chrome storage initialization.")
        console.log(e);
    }
    // Get the canvas token from the user
    token = storageCache.token;
    example_url = "https://canvas.instructure.com/api/v1/courses?access_token=";
    // CORS_WORKAROUND_URL = important url that will prepend an
    // "Access-Control-Allow-Origin" onto the CANVAS API response's header
    // See: https://stackoverflow.com/questions/43262121/trying-to-use-fetch-and-pass-in-mode-no-cors
    cors_workaround_url = "https://cors-anywhere.herokuapp.com";
    //post_login_url = cors_workaround_url + "/"+ example_url + token;
    other_login_url = cors_workaround_url + "/"+ example_url + token;
    options = {
        method: 'GET'
        //'Authorization': 'Bearer ${token}'
    };
    api_output_box = document.getElementById("test-api-output");
    fetch(other_login_url, options)
        .then(response => {
            if(!response.ok){
                console.log("An error arose when fetching from the Canvas API, its response is: ");
                console.log(response);
                api_output_box.innerHTML = ("Response code: " + response.status + " Response Text: " + response.statusText);
                if (response.status == "403"){
                    console.log("TEST: Displaying 403 cors fix string... ");
                    fix_cors = `.\nThe 403 error often arises from CORS issues. Try fixing it by going 
                    \n to this url and clicking 'Request temporary access to the demo server' button:\n
                    https://cors-anywhere.herokuapp.com/corsdemo`;
                    api_output_box.insertAdjacentHTML('beforeend', fix_cors);
                }
                if (response.status == "401"){
                    console.log("TEST: Displaying 401 error text")
                    wrong_token = `.\n The 401 'Unauthorized' error means your CANVAS access token is incorrect or missing.
                    \n Try submitting your CANVAS API access token again, and if that doesn't work try another token.`
                    api_output_box.insertAdjacentHTML('beforeend', wrong_token);
                }
                throw new Error('ERROR - manually caught: in fetch');
            }
            else
                return response;
            }) 
        .then(response => response.text()) // Read the response as text
        .then(response_text => api_output_box.innerHTML = response_text)
        
    // do stuff after the request here

});
