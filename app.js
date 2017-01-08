'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const routes = require('./routes');
const app = express();

/* View Engine Setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* App Stacks */
app.use(bodyParser.urlencoded({ // parse application/x-www-form-urlencoded
    extended: false
}));
app.use('/', routes);

module.exports = app;