# Canvas++ (Canvas Chrome Extension) **PROTOTYPE**
##### CS 422: Software Methodologies
##### Ethan Aasheim, Alder French, Blake Skelly, Juan Rios, Spike Chen

###### NOTE: These instructions are temporary and only for the prototype. There are some weird workarounds to make the prototype function correctly, but this will hopefully be polished in the final version to simplify the setup process. </em></p>

## Setting up Canvas++
### Clone Github Repo
1. Go to this link: https://github.com/johnriverz/CanvasPlusPlus/tree/alder
2. Click on the green dropdown button labeled "**<> Code**" to download the repo using your method of choice.
3. After successfully downloading the repo to your local machine, you will now be able to load up the extension in a Chrome broswer.
  
### Loading Chrome Extension
1. Go to: chrome://extensions
2. In the upper left corner, click on "**Load unpacked**".
3. Select the folder the repo is located in and open it. You should see a small pop-up in the bottom left corner of your screen labeled "**Extension loaded**".
4. In the upper right corner of your screen, click on the puzzle piece icon to find the extension and click on it to open. You may choose to pin the extension for quick access.

### Give Temporary Access
To work around some restrictions on the Canvas API requests, we use the cors-anywhere API to enable cross-origin requests to any link by using a demo server. Without this, our requests to   the API are blocked.
1. Go here: https://cors-anywhere.herokuapp.com/corsdemo.
2. Click on the button labeled "**Request temporary access to the demo server**".
3. The text "**You currently have temporary access to the demo server**" should appear. If at anytime the protype suddenly breaks, check if this page displays the bolded text. If not, you will need to grant access once again by clicking the button from step 2.
 
### Generate Access Token
An access token is used as a way of identifying the user that is making requests to the Canvas API. The token can be deleted or regenerated at any time.
1. Log onto Canvas.
2. Click the "**Account**" link in the left side panel.
3. Click on "**Settings**".
4. Under the "**Approved Integrations**" section, click the "**+ New Access Token**" button to generate a new access token.
5. Make sure to save this token. You cannot view it again after leaving the page, and you'll have to generate a new token if you forget it.

## Canvas++ Usage
This <em>Canvas++</em> prototype has a basic user interface consisting of four different tabs: **Assignments**, **Notifications**, **Grade Calc**, and **Access Token**. You are able to switch beteen these tabs. Only **Access Token** has implemented functionality at this time.

**Access Token Tab**
1. Open the extension. Look at step 4 under the **Loading Chrome Extension** section if you forgot how to do so.
2. Click on the "**Access Token**" tab.
3. Paste your access token into the input box.
4. Click "**Submit**".
5. Click "**Login**".
6. You should see a pop-alert with the Canvas API's response. The response is in JSON format and not entirely human-readable.
This tab, as well as all the others, will be implemented/refined with their functionality in later stages of development. This first protype is only to prove that the project idea is possible. 
