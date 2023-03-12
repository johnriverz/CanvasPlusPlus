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


function loadCourseAssignments(assignments) {
    var label = document.createElement("p");
    label.setAttribute("id", "a_Label");
    label.textContent = "- Assignments -";

    var list = "";
    list += label.outerHTML;

    for (var i = 0; i < assignments.list.length; i++) {
        list += "<div class='assignment'>";
        list += "Assignment: " + assignments.list[i];
        list += "</div>";
    }

    //console.log(document.getElementById("a_Label"));

    document.getElementById("assignment_list").innerHTML = list;
}


// TEST FUNCTIONS HERE - UNCOMMENT TO TEST
/*
test_output = login(starter_url, options, my_token);
console.log(test_output);
*/


//EXPORT FUNCTIONS FOR USE IN MAIN .JS FILE
export {getAssignments, loadCourseAssignments};
