// mbk 2020.03.16 - purpose - base client code for making calls to Blackboard Learn
// for the User's calendar.
// Leveraged from https://github.com/blackboard/BBDN-REST-AlexaSkill-Node/blob/master/alexa/bb-service.js
// which has the MIT LICENSE provided at the root of this project. 

'use strict'
/* eslint-disable func-names */
/* eslint-disable no-console */
const axios = require('axios');
const moment = require('moment-timezone');
const request = require('sync-request'); // NOT MEANT FOR PRODUCTION USE
const url = require('url');

//
// LEARN REST API CLIENT
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

// This should only be called AFTER we have a authorization code.
// TODO: REWRITE postForToken to use axios. Everything else works.
const postForToken = (req, res, learnserver, key, secret, code) => {
  console.log('ENTER postForToken');
  // build the redirectUri based on where we are currently running.
  var protocol = req.protocol;
  var subdomains = req.subdomains;
  var hostname = req.get('host');
  var path = url.parse(req.originalUrl).pathname;
  var redirectUri = protocol+"://"+subdomains+hostname+path;
  console.log(`redirectUri:${redirectUri}`);
  let tokenUrl = `https://${learnserver}/learn/api/public/v1/oauth2/token?code=${code}&redirect_uri=${redirectUri}`;
  console.log(`tokenUrl:${tokenUrl}`);

  var authHeader = 'Basic ' + new Buffer(key + ':' + secret).toString('base64');
  var options = {                
    headers: { 'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: authHeader
              },
    body: "grant_type=authorization_code",
    strictSSL: true,
    resolveWithFullResponse: false
  };

  let resp = request('POST', tokenUrl, options);
  let respBody = resp.getBody();
  console.log(`RESPONSE BODY from postForToken resp.getBody:${respBody}`);

  console.log('EXIT postForToken'); 
  return resp;
} //END postForToken

module.exports = {
  bbClient,
  postForToken
} // END module.exports = {
