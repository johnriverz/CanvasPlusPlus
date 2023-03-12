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


function loadCourseGrades(courseKey, grades) {
    var list = "<p>- Grade Calculator -</p>";
    list += "<p id='g_Label'>- Grade: -</p>";

    for (var i = 0; i < grades.list.length; i++) {
        var grade = grades.list[i];
        list += "<form class='grade'>";
        list += "<p>" + grade.name + "<p/><br>";
        //list += "<input id='grade_perc_" + courseKey + i + "' type='text' value='" + grade.score.toFixed(4);
        //list += "' class='grade_score' placeholder='" + + grade.score.toFixed(4) + "'>";
            var input = document.createElement("input");
            input.setAttribute("id", "grade_perc_" + courseKey + i);
            input.setAttribute("class", "grade_score");
            input.setAttribute("value", grade.score.toFixed(4));
            input.setAttribute("placeholder", grade.score.toFixed(4));
        list += input.outerHTML;
        list += "<label id='grade_result_" + courseKey + i;
        list += "' class='grade_perc'>/ " + grade.max.toFixed(4);
        list += " = " + formatPercentage(grade.score) + "<label/><br>";
        list += "</form>";
    }

    document.getElementById("grade_list").innerHTML = list;

    // Add grade changers
    for (var i = 0; i < grades.list.length; i++) {
        var input = document.getElementById("grade_perc_" + courseKey + i)
        input.addEventListener("onchange", handlePanelClick(courseKey, grades));
    }

    updateTotalGrade(courseKey, grades);
}


// Handle grade input change
function handlePanelClick(courseKey, grades) {
    return function() {
        updateTotalGrade(courseKey, grades);
    }
}


function updateTotalGrade(courseKey, grades) {
    var totalGrade = 0;
    for (var i = 0; i < grades.list.length; i++) {
        var score = document.getElementById("grade_perc" + courseKey + i).value;
        var grade = grades.list[i];

        // Updated percentage for that assignment
        var result = document.getElementById("grade_result_" + courseKey + i);
        result.textContent = "/ " + grade.max.toFixed(4);
        result.textContent += " = " + formatPercentage(score);

        // Cummulative score for course
        totalGrade += score * grade.weight / grade.max;
    }

    // Update course code label
    document.getElementById("a_Label").textContent = "- " + courseKey + " Grade: " + formatPercentage(totalGrade);
}


//EXPORT FUNCTIONS FOR USE IN MAIN .JS FILE
export {getGrades, loadCourseGrades};
