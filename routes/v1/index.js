'use strict';

const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { secret } = require('../../config.json').jwt;

// page here doesn't require jwt token
router.use('/login', require('./login'));

// jwt authentication middleware
router.use('/', (req, res, next) => {

    const { token } = req.query;

    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            const err2 = new Error(`Invalid token: ${err.message}`);
            err2.status = 400;
            return next(err2);
        }

        req.jwt = decoded;
        next();
    });

});

// page here requires jwt token
router.use('/ds', require('./ds'));
router.use('/gc', require('./gc'));

module.exports = router;
