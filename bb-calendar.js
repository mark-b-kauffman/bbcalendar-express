// mbk 2020.03.16 - purpose - methods that make REST calls to Learn
// for the User's calendar.
// Lifted from https://github.com/blackboard/BBDN-REST-AlexaSkill-Node/blob/master/alexa/bb-service.js
// which has the MIT LICENSE provided at the root of this project. I've just changed the name to
// bb-calendar.js should we ever want other modules that do calls other than the calendar REST calls.
// There are a few other things in here for courses and the current user that can be helpful.
// The main modification I've made is to require the learnserver parameter on all calls so we can 
// use this code to make calls to different Learn servers, not just one hard-wired one.
// I'm also going to try to 'use strict' if possible. Will likey go back and re-write the auth module
// using Axios. This code assumes you have an access/bearer token.

'use strict'
/* eslint-disable func-names */
/* eslint-disable no-console */
const axios = require('axios');
const moment = require('moment-timezone');

//
// LEARN REST API ACCESS
//
const bbClient = (learnserver, bearerToken) => {
  const client = axios.create({
    baseURL: `https://${learnserver}`
  });
  
  // Alter defaults after instance has been created
  client.defaults.headers.common.Authorization = 'Bearer ' + bearerToken;
  client.defaults.headers.common.Accept = 'application/json';
  client.defaults.headers.post['Content-Type'] = 'application/json';

  return client;
};

const currentUser = async (learnserver, accessToken) => {
  var response = await bbClient(learnserver, accessToken).get('/learn/api/public/v1/users/me');
  console.log('currentUser response: ', response.data);
  return response.data;
}

const searchCalendar = async (learnserver, accessToken, params) => {
  console.log('searching calendar with: ', params);
  const response = await bbClient(accessToken).get('/learn/api/public/v1/calendars/items', {
    params: params
  });
  console.log("searchCalender response: ", response.data);
  const filteredResponse = response.data.results
    .filter(event => {

      const startsAfter = (event, date) => {
        return date === undefined ? true : moment(event.start).isSameOrAfter(date);
      }
      const startsBefore = (event, date) => {
        return date === undefined ? true : moment(event.start).isSameOrBefore(date);
      }

      return startsAfter(event, params.since) && startsBefore(event, params.until);
    });
  console.log("searchCalender filteredResponse: ", filteredResponse);
  return filteredResponse;
};

const createPersonalCalendarItem = async (learnserver, accessToken, calendarOptions) => {
  const postOptions = {
    'type': 'Personal',
    'calendarId': 'PERSONAL',
    'title': calendarOptions.title,
    'start': calendarOptions.start,
    'end': calendarOptions.end
  };
  
  console.log('Creating calendar item with: ', postOptions);
  const response = await bbClient(learnserver, accessToken).post('/learn/api/public/v1/calendars/items', postOptions);
  console.log('createCalendarItem response: ', response.data);
  return response.data;
}

const getCourseById = async (learnserver, accessToken, courseId) => {
  const response = await bbClient(learnserver, accessToken).get(`/learn/api/public/v1/courses/${courseId}`);
  console.log('getCourseById response: ', response.data);
  return response.data;
}

const getCourseByName = async (learnserver, accessToken, courseName) => {
  const courses = await getCourses(learnserver, accessToken, {
    'name': courseName,
    'limit': 1
  });
  return courses[0];
}

const getCourses = async (learnserver, accessToken, searchOptions) => {
  const response = await bbClient(learnserver, accessToken).get('/learn/api/public/v1/courses', {
    params: searchOptions
  });
  console.log('getCourses: ', response.data);
  return response.data.results;
}

const getCourseMembership = async (accessToken, courseId) => {
  try {
    const response = await bbClient(accessToken).get(`/learn/api/public/v1/courses/${courseId}/users/me`);
    console.log('getCourseMembership response: ', response.data);
    return response.data;
  } catch (err) {
    // in case we get a 404
    return undefined;
  }
}

const getCurrentUserFinalGrade = async (accessToken, courseId) => {
  const response = await bbClient(accessToken).get(`/learn/api/public/v2/courses/${courseId}/gradebook/columns/finalGrade/users/me`);
  console.log('getCurrentUserFinalGrade response: ', response.data);
  return response.data;
}

const getStudentGrades = async (learnserver, accessToken, courseId) => {
  const response = await bbClient(learnserver, accessToken).get(`/learn/api/public/v2/courses/${courseId}/gradebook/columns/finalGrade/users`);
  console.log('getStudentGrades: ', JSON.stringify(response.data));
  return response.data.results;
}

const createAnnouncement = async (learnserver, accessToken, title, body) => {
  const postOptions = {
    'title': title,
    'body': `<!-- {\"bbMLEditorVersion\":1} --><div>${body}</div>`,
  }

  console.log('Creating announcement item with: ', postOptions);
  const response = await bbClient(learnserver, accessToken).post('/learn/api/public/v1/announcements', postOptions);

  console.log('createAnnouncement: ', response.data);
  return response.data;
}

var exports = module.exports;
exports.currentUser = currentUser;
exports.searchCalendar = searchCalendar;
exports.createPersonalCalendarItem = createPersonalCalendarItem;
exports.getCourseById = getCourseById;
exports.getCourseByName = getCourseByName;
exports.getCourses = getCourses;
exports.getCourseMembership = getCourseMembership;
exports.getCurrentUserFinalGrade = getCurrentUserFinalGrade;
exports.getStudentGrades = getStudentGrades;
exports.createAnnouncement = createAnnouncement;