'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const secret = require('../config.json').secret;
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'SMARTBOX API Server'
    });
});

router.get('/content', (req, res, next) => {
    const token = req.query.token;
    jwt.verify(token, secret, function(err, decoded) {
        if (err) {
            let e = new Error(`Invalid token: ${err.message}`);
            e.status = 400;
            return next(e);
        }

        res.json(decoded);
    });
});

router.get('/login', (req, res, next) => {

    const {
        username,
        password
    } = req.query;

    if (username === 'smartbox' && password === 'ilovesmartbox') {
        const token = jwt.sign({
            username
        }, secret, {
            expiresIn: 10
                // expiresIn: '1d'
        });

        res.json({
            token
        });
    } else {
        let e = new Error('Invalid credentials');
        e.status = 400;
        next(e);

        // res.status(400).send('Invalid Credentials');
    }

});


module.exports = router;