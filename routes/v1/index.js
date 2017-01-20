'use strict';

const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { secret } = require('../../config.json').jwt;


const auth = (req, res, next) => {
    const token = req.query.token || req.body.token;

    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            const err2 = new Error(`Invalid token: ${err.message}`);
            err2.status = 400;
            return next(err2);
        }

        req.jwt = decoded;
        next();
    });
};

router.use('/login', require('./login'));
router.use('/ds', auth, require('./ds'));
router.use('/gc', auth, require('./gc'));


module.exports = router;
