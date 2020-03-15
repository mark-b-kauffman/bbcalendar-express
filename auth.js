// mbk 2020.03.15 - purpose - does and holds authorzation to the learn system for a user
// We're going to start with one object. This module could hold a map that maps
// a user to their individual auth object. Then change the rest of the code to look that up.

'use strict'
const base64url = require('base64url');
const bodyParser = require('body-parser');
const request = require('sync-request');
const url = require('url');

var authobj = {authcode:null, server:null, token:null, user:null }; 

function getAuthCode(req, res, learnserver, key){
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
    res.redirect(authcodeUrl);
  } else {
    authobj.authcode = authobj.authcode;
  }
} // END getAuthCode

// This should only be called AFTER we have a authorization code.
function getToken(req, res, learnserver, key, secret){
  let tokenUrl = `https://${learnserver}/learn/ap/public/v1/oauth2/token?code=${authobj.authcode}`;
  console.log(`tokenUrl:${tokenUrl}`);
  var authHeader = 'Basic ' + new Buffer(key + ':' + secret).toString('base64');
  var options = {                
    headers: { 'Content-Type': 'application/x-www-form-urlencoded body',
                Authorization: authHeader
              },
    form: {grant_type: 'authorization_code'},
    strictSSL: true,
    resolveWithFullResponse: false,
    json: true
  }; 
  //let resp = request('POST', tokenUrl, options);
  //let respBody = resp.getBody();
  //console.log(`resp.getBody:${respBody}`);   
} //END getToken


module.exports = {
  authobj,
  getAuthCode,
  getToken,
}
