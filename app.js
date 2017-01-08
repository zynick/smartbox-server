'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const routes = require('./routes');
const app = express();

app.use(bodyParser.urlencoded({ // parse application/x-www-form-urlencoded
    extended: false
}));
app.use('/', routes);

module.exports = app;