//! .env folder configurations ran before anything else for security
require('dotenv').config();

//! Base essentials for creating a working app.
var express = require('express');
var cors = require('cors');
var app = express();

//! Controllers
var user = require('./controllers/usercontroller');

//! Database to postgresql connection
var sequelize = require('./db');

//TODO: Allows the use of text to be interperated as JSON
var bodyParser = require('body-parser');

//! Syncs sql database to ran server.
sequelize.sync(); // tip: pass in {force: true} for resetting tables
app.use(cors()); // Enables all CORS requests
app.use(bodyParser.json()); // App uses bodyParser with json objects
// app.use(require('./middleware/headers'));

//! Routes
app.use('/api', user);

//! Middleware validate session of user being logged in
app.use(require('./middleware/validate-session'));

//! The server runs this to check to see if it is successfuly running
app.listen(process.env.PORT, function () {
    console.log('App is now running on http://localhost:3000');
});