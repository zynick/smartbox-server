'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const routes = require('./routes');

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));   // parse application/x-www-form-urlencoded
app.use('/', routes);

module.exports = app;