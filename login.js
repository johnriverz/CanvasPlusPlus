
// PLACEHOLDER VARIABLES, THESE WILL EVENTUALLY BE PASSED FROM MAIN BUT ARE HERE NOW FOR TESTING
/*
my_token = "2391~Ozq4czr8zWrKrw0ej8vA7ZSfMLA2ZbICANL1ZZUkNYJph8LMBNiLKZL5pzA1COIA"; // paste your access token here for testing
access_token = "access_token=" + my_token;
options = {
    method: 'GET'
};

starter_url = "https://cors-anywhere.herokuapp.com/https://canvas.instructure.com/api/v1"
api_output_box = document.getElementById("test-api-output");
*/

// FUNCTION IMPLEMENTATION

/* LOGIN - Use the access key to authorize your CANVAS API requests. 
Outputs the text to be put in 
Here's an example: */

async function login(post_url, options, token_url) {
    console.log("TEST: the login button click function ran");
    // login_url == courses api call URL, since we want to get course info when logging into extension
    var login_url = post_url + "/courses?enrollment_state=active&" + token_url;
    console.log("TESTING login.js below...")
    console.log(login_url);
    const output = await fetch(login_url, options)
        .then(response => {
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
                    let wrong_token = `.\n This error means your CANVAS access token is incorrect or missing.
                    \n Try submitting your CANVAS API access token again, and if that doesn't work try another token.`
                    let error_response = api_output_box_text.concat(wrong_token);
                    console.log("TEST: The api_output_box_text is below...")
                    console.log(error_response);
                    return error_response;
                }
                throw new Error('ERROR - manually caught: in fetch');
            }
            else
                return response;
            }) 
    // below should return API response as text, or api_output_box_text error message
    return output;
}

// TEST FUNCTIONS HERE
//login(starter_url, options, access_token)

//EXPORT FUNCTIONS FOR USE IN MAIN .JS FILE
export {login};

