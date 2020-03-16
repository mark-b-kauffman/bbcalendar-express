var auth = require('../auth');
var authobj = auth.authobj;
var getAuthCode = auth.getAuthCode;
var getToken = auth.getToken;

var constants = require('../constants');
var express = require('express');
var router = express.Router();

/* GET calendar listing from Learn. Display a form for sending an new calendar item. */
router.get('/', function(req, res, next) {
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
    getToken(req,res, constants.LEARNSERVER, constants.KEY, constants.SECRET);
  }

  if (authobj.authcode != null && authobj.toke != null){

  }

  res.send(`todo: authcode:${authobj.authcode}, accesstoken:${authobj.token.access_token}, request users calendars`);

}); // END router.get('/',

module.exports = router;
