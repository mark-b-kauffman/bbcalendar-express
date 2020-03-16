// handles a POST for a new Calendar Item from calendarRequestView.js
var auth = require('../auth');
var bbCalendar = require('../bb-calendar');
var authobj = auth.authobj;

var getAuthCode = auth.getAuthCode;
var getToken = auth.getToken;

var constants = require('../constants');
var express = require('express');
var router = express.Router();

// POST to create a calendar listing on Learn. 
// Redirect to the page to display existing calendars and
// custom_content needs to look like:
/*
    'calendarId': calendarOptions.calendarId,
    'title': calendarOptions.title,
    'start': calendarOptions.start,
    'end': calendarOptions.end
*/
router.post('/', async function(req, res, next) {
  console.log(`#####POST TO new-calendar: ${req}`);
  console.log(`#####req.body:${JSON.stringify(req.body.custom_content)}`);
  let calendarOptions = JSON.parse(req.body.custom_content);
  resp = await bbCalendar.createCourseCalendarItem(constants.LEARNSERVER,
                            authobj.token.access_token,calendarOptions );
  res.redirect('/calendar');

}); // END router.post('/',

module.exports = router;
