// mbk 2020.03.15 - purpose - does and holds authorzation to the learn system for a user
// We're going to start with one object. This module could hold a map that maps
// a user to their individual auth object. Then change the rest of the code to look that up.

'use strict'
const base64url = require('base64url');
const bodyParser = require('body-parser');
const request = require('sync-request'); // NOT MEANT FOR PRODUCTION USE
const url = require('url');

var authobj = {authcode:null, server:null, token:null, user:null }; 

function getAuthCode(req, res, learnserver, key){
  console.log(`learnserver:${learnserver} key:${key}`);
  // build the redirectUri based on where we are currently running.
  var protocol = req.protocol;
  var subdomains = req.subdomains;
  var hostname = req.get('host');
  var path = url.parse(req.originalUrl).pathname;
  var redirectUri = protocol+"://"+hostname+path;
  console.log(`redirectUri: ${redirectUri}`);
  let authcodeUrl = `https://${learnserver}/learn/api/public/v1/oauth2/authorizationcode?redirect_uri=${redirectUri}&scope=*&response_type=code&client_id=${key}`;
  console.log(`authcodeUrl:${authcodeUrl}`)
  authobj.authcode = req.query.code;
  if (authobj.authcode == null) {
    console.log('authcode was null');
    res.redirect(authcodeUrl); // because we redirect here, this method MUST be called a second time.
  } else {
    authobj.authcode = authobj.authcode;
  }
} // END getAuthCode

// This should only be called AFTER we have a authorization code.
function getToken(req, res, learnserver, key, secret){
  console.log('enter getToken');
  // build the redirectUri based on where we are currently running.
  var protocol = req.protocol;
  var subdomains = req.subdomains;
  var hostname = req.get('host');
  var path = url.parse(req.originalUrl).pathname;
  var redirectUri = protocol+"://"+hostname+path;
  console.log(`redirectUri:${redirectUri}`);
  let tokenUrl = `https://${learnserver}/learn/api/public/v1/oauth2/token?code=${authobj.authcode}&redirect_uri=${redirectUri}`;
  console.log(`tokenUrl:${tokenUrl}`);

  var authHeader = 'Basic ' + new Buffer.from(key + ':' + secret).toString('base64');
  var options = {                
    headers: { 'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: authHeader
              },
    body: "grant_type=authorization_code",
    strictSSL: true,
    resolveWithFullResponse: false
  };
  // No need to POST again if we already have a token.
  // Can add check for expiry later.
  if (authobj.token == null){ 
    let resp = request('POST', tokenUrl, options);
    let respBody = resp.getBody();
    console.log(`resp.getBody:${respBody}`);
    authobj.token = JSON.parse(respBody);
  }
  console.log(`authobj.token.access_token:${authobj.token.access_token}`); 
  console.log('exit getToken'); 
} //END getToken


module.exports = {
  authobj,
  getAuthCode,
  getToken,
}
