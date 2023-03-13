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

// FUNCTION IMPLEMENTATION

/* getAssignments - description here */

async function getAssignments(post_url, header, token) {
    var token_url = "access_token=" + token;
    var assignments_url = post_url + "/courses?enrollment_state=active&" + token_url;
    var obj;

    try {
        const output = await fetch(assignments_url, header)
            .then(response => response.text()) // Read the response as text
            .then(html => {
                //alert("Here's the response from the CANVAS API: " + html);
                obj = JSON.parse(html);
                for (let i = 0; i < obj.length; i++) {
                    console.log(obj[i]);
                }
                console.log(obj);
            })
            .catch(e => {
                console.log(e)
            })
        return output
    } catch(e) {
        console.log(e)
    }
}


function loadCourseAssignments(courseKey, assignments) {
    var list = "<p id='a_Label'>- Assignments -</p>";

    // Create assignment panel
    for (var i = 0; i < assignments.list.length; i++) {
        list += "<div id='assignment" + courseKey + i + "' class='assignment'>";
        list += "<p>" + assignments.list[i] + "</p>";
        list += "<div id='a-info" + courseKey + i + "' class='closed'>";
        list += "Due date, points worth, (link to submit page?)";
        list += "</div>";
        list += "</div>";
    }

    // Render list
    document.getElementById("assignment_list").innerHTML = list;

    // Update course code label
    document.getElementById("a_Label").textContent = "- " + courseKey + " Assignments -";

    // Add panel click handlers
    for (var i = 0; i < assignments.list.length; i++) {
        var panel = document.getElementById("assignment" + courseKey + i)
        panel.addEventListener("click", handlePanelClick(courseKey, assignments.list.length, i));
    }
}


// Handle click on assignment panels
function handlePanelClick(courseKey, length, index) {
    return function() {
        openAssignment(courseKey, length, index);
    }
}


// Expand the assignment panel
function openAssignment(courseKey, length, index) {
    var panel = document.getElementById("a-info" + courseKey + index);
    var closed = false;
    if (!panel.classList.contains("closed")) closed = true;

    // Close all other panels
    for (var i = 0; i < length; i++) {
        document.getElementById("a-info" + courseKey + i).setAttribute("class", "closed");
    }

    // Expand curent pannel
    if (closed);
        panel.setAttribute("class", "a-details");
}

// TEST FUNCTIONS HERE - UNCOMMENT TO TEST
/*
test_output = login(starter_url, options, my_token);
console.log(test_output);
*/


//EXPORT FUNCTIONS FOR USE IN MAIN .JS FILE
export {getAssignments, loadCourseAssignments};
