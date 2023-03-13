/* notifications.js */

// PLACEHOLDER VARIABLES, THESE WILL EVENTUALLY BE PASSED FROM Canvas++.js BUT ARE HERE NOW FOR TESTING
// UNCOMMENT THEM TO TEST FROM WITHIN THIS JS FILE
/*
// paste your access token here for testing
let my_token = "2391~Ozq4czr8zWrKrw0ej8vA7ZSfMLA2ZbICANL1ZZUkNYJph8LMBNiLKZL5pzA1COIA";
let options = {
    method: 'GET'
};
let starter_url = "https://cors-anywhere.herokuapp.com/https://canvas.instructure.com/api/v1"
*/

// FUNCTION IMPLEMENTATION

/* getAssignments - description here */

async function getNotifications(post_url, header, token) {
    var token_url = "access_token=" + token;
    var assignments_url = post_url + "/courses?enrollment_state=active&" + token_url;
    var obj;

    try {
        const output = await fetch(assignments_url, header)
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
        return output
    } catch(e) {
        console.log(e)
    }
}

async function dashboard(postUrl, header, token) {
    url = postUrl + "/dashboard/dashboard_cards" + token;

    try {
        fetch(url, header)
            .then(response => response.text()) // Read the response as text
            .then(html => alert(html))
    } catch(e) {
        console.log(e)
    }
}

// TEST FUNCTIONS HERE - UNCOMMENT TO TEST
/*
test_output = login(starter_url, options, my_token);
console.log(test_output);
*/

function loadCourseNotifications(courseKey, notifications) {
    var list = "<p id='n_Label'>- Notifications -</p>";

    for (var i = 0; i < notifications.list.length; i++) {
        list += "<div id='notification" + courseKey + i + "' class='notification'>";
        list += "<p>" + notifications.list[i] + "</p>";
        list += "<div id='n-info" + courseKey + i + "' class='closed'>";
        list += "Date sent, message, (link to Canvas page?)";
        list += "</div>";
        list += "</div>";
        list += "</div>";
    }

    // Render list
    document.getElementById("notifications_list").innerHTML = list;

    // Update course code label
    document.getElementById("n_Label").textContent = "- " + courseKey + " Notifications -";

    // Add panel click handlers
    for (var i = 0; i < notifications.list.length; i++) {
        var panel = document.getElementById("notification" + courseKey + i)
        panel.addEventListener("click", handlePanelClick(courseKey, notifications.list.length, i));
    }
}


// Handle click on assignment panels
function handlePanelClick(courseKey, length, index) {
    return function() {
        openNotification(courseKey, length, index);
    }
}


// Expand the assignment panel
function openNotification(courseKey, length, index) {
    var panel = document.getElementById("n-info" + courseKey + index);
    var closed = false;
    if (!panel.classList.contains("closed")) closed = true;

    // Close all other panels
    for (var i = 0; i < length; i++) {
        document.getElementById("n-info" + courseKey + i).setAttribute("class", "closed");
    }

    // Expand curent pannel
    if (closed);
        panel.setAttribute("class", "n-details");
}


//EXPORT FUNCTIONS FOR USE IN MAIN .JS FILE
export {getNotifications, loadCourseNotifications};
