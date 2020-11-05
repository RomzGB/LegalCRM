// Client ID and API key from the Developer Console
var CLIENT_ID = '427165306109-ka0skkfvdtg1rt36u6n4uiqrhp8eh9qq.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAxv36BcCN8tQyIk_plz8sJSpuRR5NJAZs';
// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";
var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');














/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        //listUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    alert(new Date().toISOString())
    //addEvent()
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        appendPre('Upcoming events:');

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre(event.summary + ' (' + when + ')')
            }
        } else {
            appendPre('No upcoming events found.');
        }
    });
}


function addEvent(eventStartTime, eventText, numbersOfDaysBeforeEventForNotification) {
    if(eventStartTime[15] < 9){
        let newMinute = parseInt(eventStartTime[15])
        newMinute++
        let modifiedEventStartTime = eventStartTime.split('')
        modifiedEventStartTime[15] = newMinute
        modifiedEventStartTime = modifiedEventStartTime.join('')
        var eventEndDateTime = modifiedEventStartTime
    }

    //var eventEndDateTime = document.getElementById("eventEndDateTime").value
    //var eventText = document.getElementById("eventText").value
    //alert(eventStartTime)
    var event1 = {
        'summary': eventText,
        'location': 'Pardes Hanna-Karkur, Israel',
        'description': 'Assignment For Real Estate Transaction',
        'start': {
            'dateTime': eventStartTime + ':00',
            'timeZone': 'Asia/Jerusalem'
        },
        'end': {
            'dateTime': eventEndDateTime + ':00',
            'timeZone': 'Asia/Jerusalem'
        },
        'recurrence': [
            //'RRULE:FREQ=DAILY;COUNT=2'
        ],
        // 'attendees': [
        //     { 'email': 'romzgb1@gmail.com' }
        // ],
        'reminders': {
            'useDefault': false,
            'overrides': [
                { 'method': 'popup', 'minutes': numbersOfDaysBeforeEventForNotification * 60 * 24 }
            ]
        }
    };

    var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event1
    });

    request.execute(function (event1) {
        appendPre('Event created: ' + event1.htmlLink);
    });
}