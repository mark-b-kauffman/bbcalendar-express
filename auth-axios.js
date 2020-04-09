// mbk 2020.03.16 - purpose - same as auth.js - does and holds authorzation to the learn 
// system for a user. auth.js is working. Now we build this version to use the async axios. 
// We're going to start with one object. This module could hold a map that maps
// a user to their individual auth object. Then change the rest of the code to look that up.

'use strict'
const axios = require('axios');
const base64url = require('base64url');
const bbClient = require('./bb-client');
const bodyParser = require('body-parser');
// const request = require('sync-request'); // NOT MEANT FOR PRODUCTION USE
const url = require('url');

var authobj = {authcode:null, server:null, token:null, user:null }; 

function getAuthCode(req, res, learnserver, key){  // async not required we're just redirecting.
  console.log(`learnserver:${learnserver} key:${key}`);
  // build the redirectUri based on where we are currently running.
  var protocol = req.protocol;
  var subdomains = req.subdomains;
  var hostname = req.get('host');
  var path = url.parse(req.originalUrl).pathname;
  var redirectUri = protocol+"://"+subdomains+hostname+path;
  console.log(`redirectUri: ${redirectUri}`);
  let authcodeUrl = `https://${learnserver}/learn/api/public/v1/oauth2/authorizationcode?redirect_uri=${redirectUri}&scope=*&response_type=code&client_id=${key}`;
  console.log(`authcodeUrl:${authcodeUrl}`)
  authobj.authcode = req.query.code;
  if (authobj.authcode == null) {
    console.log('authcode was null');
    res.redirect(authcodeUrl); // Because we redirect here, this method MUST be called a second time.
  } else {
    authobj.authcode = authobj.authcode;
  }
} // END getAuthCode

// The following should only be called AFTER we have a authorization code.
// We've switched this from what we had in auth.js to use axios.
async function getToken(req, res, learnserver, key, secret){
  console.log('ENTER getToken');
  // Unlike the auth.js getToken with auth-axios we've moved the 
  // code to call axios to get the token where all of the other
  // code for callling axios is, to bb-client.js
  
  // No need to POST again if we already have a token.
  // Todo: check for expiry.
  if (authobj.token == null){ 
    let resp =  bbClient.postForToken(req, res, learnserver, key, secret, authobj.authcode);
    let respBody = resp.getBody();
    console.log(`getToken called postForToken and got resp.getBody:${respBody}`);
    authobj.token = JSON.parse(respBody);
  }
  console.log(`authobj.token.access_token:${authobj.token.access_token}`); 
  console.log('EXIT getToken'); 
} //END getToken

// mbk - I prefer this syntax because it's clear exactly what is going on
// and is succinct. 
module.exports = {
  authobj,
  getAuthCode,
  getToken,
} // END module.exports = {
