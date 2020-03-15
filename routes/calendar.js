var auth = require('../auth');
var authobj = auth.authobj;
var getAuthCode = auth.getAuthCode;
var getToken = auth.getToken;

var constants = require('../constants');
var express = require('express');
var router = express.Router();

/* GET calendar listing from Learn. */
router.get('/', function(req, res, next) {
  if (authobj.authcode === null){
    // got no authorization code. need to get one.
    // In this first case we redirect to get the code on the query string.
    getAuthCode(req, res, constants.LEARNSERVER, constants.KEY);
  } else {
    // This is REQUIRED. In this second case we pull the code from the query string.
    getAuthCode(req, res, constants.LEARNSERVER, constants.KEY);
  }

  if (authobj.authcode != null && authobj.token == null){
    getToken(req,res, constants.LEARNSERVER, constants.KEY, constants.SECRET);
  }

  res.send(`todo: authcode ${authobj.authcode}, accesstoken, request users calendars`);
});

module.exports = router;
