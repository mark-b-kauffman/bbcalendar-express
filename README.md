Demonstration of getting calendar items and creating them in Blackboard Learn.
As of 2020.03.16 we're using sync-request to make the requests. 
https://www.npmjs.com/package/sync-request
This makes it simple to follow the flow of making REST requests to Learn and 
handling the response. The doc states NOT MEANT FOR PRODUCTION because it is 
not asynchronous.  

Built with: http://expressjs.com/en/starter/generator.html#express-application-generator  
npm install express-generator -g  
express bbcalendar-express\
(base) ganymede:bbcalendar-express mbk$ express --version\
4.16.1\
(base) ganymede:bbcalendar-express mbk$ node -v\
v10.15.3\
(base) ganymede:bbcalendar-express mbk$ npm -v\
6.14.2\

2020.03.16 - WIP. Visit /calendar . Currently will get you an access token using 3LO. First we get
an authorization code, if you're not logged into Learn you'll be asked to. Then we
do the POST to get the access token.

