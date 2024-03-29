/* assignments.js */

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

// IMPORTS
//import {login, getCourseIDs} from "./login.js"

// FUNCTION IMPLEMENTATION


/* getAssignments - description here */
async function getAssignments(post_url, options, token, course, course_id) {
    console.log("Test: Logging course_id from getAssignments:");
    console.log(course_id);
    var token_url = "access_token=" + token;
    let all_courses_ass = []

    //console.log(key + ": " + value);
    console.log("Upcoming assignments in " + course + ":");
    const course_url_part = "/courses/" + course_id + "/assignments?bucket=upcoming&";
    let ass_url = post_url + course_url_part + token_url;
    console.log("Calling the following assignment GET URL from getAssignments:");
    console.log(ass_url);
    let ass_list = [];
    const res = await fetchAssignments(ass_url, options).then((assign) => {
        for (let i = 0; i < assign.length; i++) {
            console.log(assign[i].name + " is due at: " + assign[i].due_at);
            ass_list.push(assign[i].name);
        }
        console.log(ass_list);
        return ass_list;
    });
    all_courses_ass.push(res);
    console.log(all_courses_ass)
    return all_courses_ass
}

async function fetchAssignments(ass_url, options){
    const output = await fetch(ass_url, options).then(response => {
        if (!response.ok) {
            console.log("An error arose when fetching from the Canvas API, its response is: ");
            console.log(response);
            let api_output_box_text = ("Response code: " + response.status + " Response Text: " + response.statusText);
            if (response.status == "403") {
                console.log("TEST: Displaying 403 cors fix string... ");
                const fix_cors = `.\nThe 403 error often arises from CORS issues. Try fixing it by going
                    \n to this url and clicking 'Request temporary access to the demo server' button:\n
                    https://cors-anywhere.herokuapp.com/corsdemo`;
                let error_response = api_output_box_text.concat(fix_cors);
                return error_response;
            }
            if (response.status == "401") {
                console.log("TEST: Displaying 401 error text")
                const wrong_token = `.\n This error means your CANVAS access token is incorrect or missing.
                    \n Try submitting your CANVAS API access token again, and if that doesn't work try another token.`
                let error_response = api_output_box_text.concat(wrong_token);
                console.log("TEST: The api_output_box_text is below...")
                console.log(error_response);
                return error_response;
            }
            throw new Error('ERROR - manually caught: in fetch');
        }
        else
            return response.text();
    });
    //console.log(JSON.parse(output));
    return JSON.parse(output);
}


function loadCourseAssignments(courseName, assignments) {
    var list = "<p id='a_Label'>- Assignments -</p>";

    // Create assignment panel
    for (var i = 0; i < assignments.length; i++) {
        list += "<div id='assignment" + courseName + i + "' class='assignment'>";
        list += "<p>" + assignments[i] + "</p>";
        list += "<div id='a-info" + courseName + i + "' class='closed'>";
        list += "Due date, points worth, (link to submit page?)";
        list += "</div>";
        list += "</div>";
    }

    // Render list
    document.getElementById("assignment_list").innerHTML = list;

    // Update course code label
    document.getElementById("a_Label").textContent = "- " + courseName + " Assignments -";

    // Add panel click handlers
    for (var i = 0; i < assignments.length; i++) {
        var panel = document.getElementById("assignment" + courseName + i)
        panel.addEventListener("click", handlePanelClick(courseName, assignments.length, i));
    }
}


// Handle click on assignment panels
function handlePanelClick(courseName, length, index) {
    return function() {
        openAssignment(courseName, length, index);
    }
}


// Expand the assignment panel
function openAssignment(courseName, length, index) {
    var panel = document.getElementById("a-info" + courseName + index);
    var closed = false;
    if (!panel.classList.contains("closed")) closed = true;

    // Close all other panels
    for (var i = 0; i < length; i++) {
        document.getElementById("a-info" + courseName + i).setAttribute("class", "closed");
    }

    // Expand curent pannel
    if (closed);
        panel.setAttribute("class", "a-details");
}


//EXPORT FUNCTIONS FOR USE IN MAIN .JS FILE
export {getAssignments, loadCourseAssignments};
