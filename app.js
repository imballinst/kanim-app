require('dotenv').config();

// Import modules
global.Promise = require('bluebird');

const express = require('express');
const bodyParser = require('body-parser');

// Instantiate imported modules
const app = express();

// Middlewares
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ // for parsing URL-encoded bodies
  extended: true,
}));

// Export app
module.exports = app;
