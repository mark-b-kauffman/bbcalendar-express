var auth = require('../auth');
var bbCalendar = require('../bb-calendar');
var authobj = auth.authobj;
var crview = require('../views/calendarRequestView');
var render = crview.render;
var getAuthCode = auth.getAuthCode;
var getToken = auth.getToken;

var constants = require('../constants');
var express = require('express');
var router = express.Router();

/* GET calendar listing from Learn. Display a form for sending an new calendar item. */
// 2020.03.16 Modified the router to be async so we can call async code from the 
//            functions it calls.
router.get('/', async function(req, res, next) {
  // The following will look for an authorization code on the query string parameter code=
  // If it's there it's placed in authobj.authcode. If not we go through the first bit of flow
  // for 3LO. The redirect_uri we give is this same /calendar route. Hence, once logged in 
  // we come back to /calandar?code=<thecode> and come back here. Then we have the code
  // so no redirect. The following then just sets the code on authobj.authcode.
  getAuthCode(req, res, constants.LEARNSERVER, constants.KEY);

  if (authobj.authcode != null){
    // POST to the Learn server to get the access token.
    // Or if we already have the token, there will be no POST.
    // We can add code to getToken for managing expiration later.
    // The following does cache the access token so we're not doing the 
    // POST on every getToken
    getToken(req,res, constants.LEARNSERVER, constants.KEY, constants.SECRET);
  }

  if (authobj.token != null) { // only make our REST requests after we have a token.access_token
    let currentUser = '';
    let currentUserCal = '';

    console.log(`Calling bbCalendar.currentUser learnserver:${constants.LEARNSERVER} token:${authobj.token.access_token}`);
    currentUser = await bbCalendar.currentUser(constants.LEARNSERVER, authobj.token.access_token);

    // currentUserCal = await bbCalendar.searchCalendar(constants.LEARNSERVER, authobj.token.access_token, {since:"2018-01-01T00:00:00.000Z", until: "2050-02-01T00:00:00.000Z"} );
    currentUserCal = await bbCalendar.searchCalendar(constants.LEARNSERVER, authobj.token.access_token, {
      since: '2000-01-D01T00:00:00.000Z',
      until: '2030-01-D01T00:00:00.000Z',
      sort: 'start'
    });

    res.send(`${render(authobj.token.access_token, currentUser, currentUserCal)}`);
    // res.send(`authcode:${authobj.authcode},</br> accesstoken:${authobj.token.access_token},</br> Request Users:${JSON.stringify(currentUser)},</br></br> Calendars ${JSON.stringify(currentUserCal)}`);
  }// END if (authobj.token != null) {
}); // END router.get('/',

module.exports = router;
