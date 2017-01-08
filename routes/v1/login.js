'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const secret = require('../../config.json').secret;
const router = express.Router();

// login
router.get('/', (req, res, next) => {

    const {
        username,
        password
    } = req.query;

    if (username === 'dev@smartboxasia.com' && password === 'ilovesmartbox') {

        const token = jwt.sign({
            username
        }, secret, {
            expiresIn: '1d'
        });

        res.json({
            token
        });

    } else {

        let e = new Error('Invalid credentials');
        e.status = 400;
        next(e);

    }

});


module.exports = router;