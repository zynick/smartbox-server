'use strict';

const jwt = require('jsonwebtoken');
const router = require('express').Router();
const secret = require('../../config.json').secret;

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

router.use('/ds', require('./ds'));

module.exports = router;
