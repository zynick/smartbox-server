'use strict';

const jwt = require('jsonwebtoken');
const router = require('express').Router();
const config = require('../../config.json');
const login = config.login;
const { secret, expiresIn } = config.jwt;


router.get('/', (req, res, next) => {

    const { email, password } = req.query;

    if (email !== login.email || password !== login.password) {
        const err = new Error('Invalid credentials');
        err.status = 400;
        return next(err);
    }

    const token = jwt.sign({ email }, secret, { expiresIn });

    res.json({ token });

});


module.exports = router;
