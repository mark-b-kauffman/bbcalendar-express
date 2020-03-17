Demonstration of getting calendar items and creating them in Blackboard Learn.
As of 2020.03.16 we're using sync-request to make the requests to get the authorization
code and access token. https://www.npmjs.com/package/sync-request
This makes it simple to follow the flow of making REST requests to Learn and 
handling the response. The doc states NOT MEANT FOR PRODUCTION because it is 
not asynchronous. We did use axios for the REST calendar API requests, which is
asynchronous. ToDo: Switch from using sync-request to axios for the OAuth 
requests. 

Built with: http://expressjs.com/en/starter/generator.html#express-application-generator  
npm install express-generator -g  
express bbcalendar-express\
(base) ganymede:bbcalendar-express mbk$ express --version\
4.16.1\
(base) ganymede:bbcalendar-express mbk$ node -v\
v10.15.3\
(base) ganymede:bbcalendar-express mbk$ npm -v\
6.14.2\

Be sure you modify constants.js with the learnserer, key and secret you are working with.

2020.03.16 - WIP. Visit /calendar. First we get an authorization code, if you're not logged into Learn you'll be asked to. Then we do a POST to get the access token. Next we do a REST request
to the calendar items endpoint to get the logged in user's course calendar items. 
We display all the calendar items as JSON and a form from which you can submit your
JSON to create a new calendar item.

