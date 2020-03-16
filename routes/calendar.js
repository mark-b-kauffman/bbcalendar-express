var auth = require('../auth');
var bbCalendar = require('../bb-calendar');
var authobj = auth.authobj;
var getAuthCode = auth.getAuthCode;
var getToken = auth.getToken;

var constants = require('../constants');
var express = require('express');
var router = express.Router();

/* GET calendar listing from Learn. Display a form for sending an new calendar item. */
// 2020.03.16 modified the router to be async so we can call async code.
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

  let currentUser = '';

  console.log(`Calling bbCalendar.currentUser learnserver:${constants.LEARNSERVER} token:${authobj.token.access_token}`);
  currentUser = await bbCalendar.currentUser(constants.LEARNSERVER, authobj.token.access_token);

  res.send(`todo: authcode:${authobj.authcode}, accesstoken:${authobj.token.access_token}, request user's:${JSON.stringify(currentUser)} calendars`);

}); // END router.get('/',

module.exports = router;
