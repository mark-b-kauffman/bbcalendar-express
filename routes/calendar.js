var auth = require('../auth');
var authobj = auth.authobj;
var getAuthCode = auth.getAuthCode;

var constants = require('../constants');
var express = require('express');
var router = express.Router();

/* GET calendar listing from Learn. */
router.get('/', function(req, res, next) {
  if (authobj.authcode === null){
    // got no authorization code. need to get one.
    getAuthCode(req, constants.LEARNSERVER, constants.KEY);
  } else {
    auth.getAuthCode(req, constants.LEARNSERVER, constants.KEY);
  }
  res.send(`todo: authcode ${authobj.authcode}, accesstoken, reuqest users calendars`);
});

module.exports = router;
