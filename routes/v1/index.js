'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const secret = require('../../config.json').secret;
const router = express.Router();

router.use('/login', require('./login'));

// jwt authentication middleware
router.use('/', (req, res, next) => {
    const token = req.query.token;
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            let e = new Error(`Invalid token: ${err.message}`);
            e.status = 400;
            return next(e);
        }
        req.jwt = decoded;
        next();
    });
});

router.use('/ds', require('./ds'));

module.exports = router;