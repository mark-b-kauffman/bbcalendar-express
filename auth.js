// mbk 2020.03.15 - purpose - does and holds authorzation to the learn system for a user
// We're going to start with one object. This module could hold a map that maps
// a user to their individual auth object. Then change the rest of the code to look that up.

'use strict'

const request = require('sync-request');

var authobj = {authcode:null, server:null, token:null, user:null }; 

function getAuthCode(req, learnserver, key){
  console.log(`learnserver:${learnserver} key:${key}`)
  let url = `https://${learnserver}/learn/api/public/v1/oauth2/authorizationcode?redirect_uri=http://localhost:3000&scope=*&response_type=code&client_id=${key}`;
  if (authobj.authcode == null) {
    console.log('authcode was null');
    authobj.authcode = 1;
  } else {
    authobj.authcode = authobj.authcode + 1;
  }
}
module.exports = {
  authobj,
  getAuthCode,
}