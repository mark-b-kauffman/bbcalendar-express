var auth = require('../auth');
var constants = require('../constants');
var express = require('express');
var router = express.Router();

/* GET calendar listing from Learn. */
router.get('/', function(req, res, next) {
  if (auth.authcode === null){
    // got no authorization code. need to get one.
    // auth.getAuthCode(req, constants.LEARNSERVER, constants.KEY);
    auth.authcode = 1;
  } else {auth.authcode = auth.authcode+1;}
  res.send(`todo: authcode ${auth.authcode}, accesstoken, reuqest users calendars`);
});

module.exports = router;
