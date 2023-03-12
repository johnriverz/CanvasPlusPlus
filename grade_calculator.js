/* grade_calculator.js */

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

async function getGrades(post_url, header, token) {
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


// TEST FUNCTIONS HERE - UNCOMMENT TO TEST
/*
test_output = login(starter_url, options, my_token);
console.log(test_output);
*/

function formatPercentage(value) {
    return (value).toLocaleString(undefined, {
        style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2
    });
};


function loadCourseGrades(grades) {
    var list = "<p id='g_Label'>- Grade Calculator -</p>";

    for (var i = 0; i < grades.list.length; i++) {
        var grade = grades.list[i];
        list += "<div class='grade'>";
        list += "<p class='grade_label'>";
        list += "<input type='text' valuie='" + grade.name + "<p/>"
        list += "' id='grade_perc_" + i + "' name='lname'>";
        list += "<p>" + grade.score.toFixed(4) * grade.weight.toFixed(4) + "/" + grade.weight.toFixed(4)
        list += " :: " + formatPercentage(grade.score) + "<p/>";
        list += "</div>";
    }

    document.getElementById("grade_list").innerHTML = list;
}


//EXPORT FUNCTIONS FOR USE IN MAIN .JS FILE
export {getGrades, loadCourseGrades};