/* login.js */

// PLACEHOLDER VARIABLES, THESE WILL EVENTUALLY BE PASSED FROM Canvas++.js BUT ARE HERE NOW FOR TESTING
// UNCOMMENT THEM TO TEST FROM WITHIN THIS JS FILE 
/* */
// paste your access token here for testing
let my_token = "2391~Ozq4czr8zWrKrw0ej8vA7ZSfMLA2ZbICANL1ZZUkNYJph8LMBNiLKZL5pzA1COIA"; 
let options = {
    method: 'GET', /*
    headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }, */
};
let starter_url = "https://cors-anywhere.herokuapp.com/https://canvas.instructure.com/api/v1";



// FUNCTION IMPLEMENTATION

/* LOGIN - Use the access key to authorize your CANVAS API requests. 
Outputs the text to be put into the "test-api-output" box in our .html
*/

async function login(post_url, options, token) {
    console.log("TEST: the login button click function ran");
    // login_url == courses api call URL, since we want to get course info when logging into extension
    var token_url = "access_token=" + token;
    var login_url = post_url + "/courses?enrollment_state=active&" + token_url;
    console.log("TESTING login.js . the url we call in it is below...")
    console.log(login_url);
    const output = await fetch(login_url, options).then(response => {
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
                    console.log("TEST: The api_output_box_text is below...")
                    console.log(error_response);
                    return error_response;
                }
                throw new Error('ERROR - manually caught: in fetch');
            }
            else
                return response.text();
            }) 
    // below should return API response as text, or api_output_box_text error message
    //console.log(output);
    return output;
}

/* getCourseIDs - fetches the course IDs for user's active courses.
    Returns them in a map (course_code: id) */
async function getCourseIDs(response) { // Pass in response.text()
    //console.log(response);
    let r_json = JSON.parse(response);
    let course_ids = new Map();
    r_json.forEach((course) => {
        //console.log(course.id);
        course_ids.set(course.course_code, course.id);
    });
    console.log(course_ids)
    return course_ids;
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


// TEST FUNCTIONS HERE - UNCOMMENT TO TEST
/*
test_output = await login(starter_url, options, my_token);
//console.log(test_output);
console.log(getCourseIDs(test_output));
*/



//EXPORT FUNCTIONS FOR USE IN MAIN .JS FILE
export {login, getCourseIDs};

