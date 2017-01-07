'use strict';

const bodyParser = require('body-parser');
const express = require('express');
// const expressJWT = require('express-jwt');
// const jwt = require('jsonwebtoken');
const path = require('path');
// const secret = require('config.json').secret;
const index = require('./routes/index');
// const users = require('./routes/users');
const app = express();
const isProd = app.get('env') === 'production';


/* View Engine Setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


/* App Stacks */
app.use(bodyParser.urlencoded({ // parse application/x-www-form-urlencoded
    extended: false
}));
// app.use(expressJWT({ // json web token handling
//     secret
// }).unless({
//     path: ['/', '/login']
// }));
app.use('/', index); // routes
// app.use('/users', users);


/* Catch 404 and Forward to Error Handler */
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* Error Handlers */
app.use((err, req, res, next) => {
    let result = {
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
    };
    // hide stacktrace in production, show otherwise
    if (!isProd) {
        result.stack = err.stack;
    }
    res.status(result.status).json({
        error: result
    });
});


module.exports = app;