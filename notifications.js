/* assignments.js */

// PLACEHOLDER VARIABLES, THESE WILL EVENTUALLY BE PASSED FROM Canvas++.js BUT ARE HERE NOW FOR TESTING
// UNCOMMENT THEM TO TEST FROM WITHIN THIS JS FILE
/*
// paste your access token here for testing
let my_token = "2391~U4WL4myoVU6GPD6LENPjZ6GYfPFUD5FD6NcfT78ibMBzRGRag1zhw6sm02LBjbIS";
let options = {
    method: 'GET'
};
let starter_url = "https://cors-anywhere.herokuapp.com/https://canvas.instructure.com:443/api/v1"
*/

// FUNCTION IMPLEMENTATION

/* getAnnouncements - description here */

async function getNotifications(post_url, options, token, course_id) {
    var token_url = "access_token=" + token;
    var announcement_url = post_url + "/courses/" + course_id + "/activity_stream?" + token_url;
    var obj;

    console.log(announcement_url);

    try {
        const output = await fetch(announcement_url, options).then(response => {
            if(!response.ok){
                console.log("An error arose when fetching from the Canvas API, its response is: ");
                console.log(response);
                let api_output_box_text = ("Response code: " + response.status + " Response Text: " + response.statusText);
                if (response.status == "403"){
                    console.log("TEST: Displaying 403 cors fix string... ");
                    const fix_cors = `.\nThe 403 error often arises from CORS issues. Try fixing it by going
                    \n to this url and clicking 'Request temporary access to the demo server' button:\n
                    https://cors-anywhere.herokuapp.com/corsdemo`;
                    let error_response = api_output_box_text.concat(fix_cors);
                    return error_response;
                }
                if (response.status == "401"){
                    console.log("TEST: Displaying 401 error text")
                    const wrong_token = `.\n This error means your CANVAS access token is incorrect or missing.
                    \n Try submitting your CANVAS API access token again, and if that doesn't work try another token.`
                    let error_response = api_output_box_text.concat(wrong_token);
                    console.log("TEST: The api_output_box_text is below...");
                    console.log(error_response);
                    return error_response;
                }
                if (response.status == "404"){
                    console.log("TEST: Could not list notifications for this course...");
                    const no_data = `.\n This course does not allow for the API to send GET requests.
                    \n No notifications can be displayed.`
                    let error_response = api_output_box_text.concat(no_data)
                    console.log("TEST: The api_output_box_text is below...");
                    console.log(error_response);
                    return error_response;
                }
                //throw new Error('ERROR - manually caught: in fetch');
            }
            else {
                return response.text();
            }
        })

            .then(html => {
                //alert("Here's the response from the CANVAS API: " + html);
                obj = JSON.parse(html);
                /*
                for (let i = 0; i < obj.length; i++) {
                    console.log(obj[i]);
                }
                console.log(obj);
                */
                return JSON.stringify(obj);
            })
            .catch(e => {
                console.log(e)
            })
        return output
    } catch(e) {
        console.log(e)
    }
}


function loadCourseNotifications(courseName, notifications) {
    var list = "<p id='n_Label'>- Notifications -</p>";

    for (var i = 0; i < notifications.length; i++) {
        list += "<div id='notification" + courseName + i + "' class='notification'>";
        list += "<p>" + notifications[i].title + "</p>";
        list += "<div id='n-info" + courseName + i + "' class='closed'>";
        list += notifications[i].message;
        list += "</div>";
        list += "</div>";
        list += "</div>";
    }


    // Render list
    document.getElementById("notifications_list").innerHTML = list;

    // Update course code label
    document.getElementById("n_Label").textContent = "- " + courseName + " Notifications -";

    // Add panel click handlers
    for (var i = 0; i < notifications.length; i++) {
        var panel = document.getElementById("notification" + courseName + i)
        panel.addEventListener("click", handlePanelClick(courseName, notifications.length, i));
    }
}


// Handle click on assignment panels
function handlePanelClick(courseName, length, index) {
    return function() {
        openNotification(courseName, length, index);
    }
}


// Expand the assignment panel
function openNotification(courseName, length, index) {
    var panel = document.getElementById("n-info" + courseName + index);
    var closed = false;
    if (!panel.classList.contains("closed")) closed = true;

    // Close all other panels
    for (var i = 0; i < length; i++) {
        document.getElementById("n-info" + courseName + i).setAttribute("class", "closed");
    }

    // Expand curent pannel
    if (closed);
        panel.setAttribute("class", "n-details");
}


//EXPORT FUNCTIONS FOR USE IN MAIN .JS FILE
export {getNotifications, loadCourseNotifications};
