'use strict';

const jwt = require('jsonwebtoken');
const router = require('express').Router();
const config = require('../../config.json');
const {
    email: loginEmail,
    password: loginPassword
} = config.login;
const { secret, expiresIn } = config.jwt;


router.post('/', (req, res, next) => {
    const { email, password } = req.body;

    if (email !== loginEmail || password !== loginPassword) {
        const err = new Error('Invalid credentials');
        err.status = 400;
        return next(err);
    }

    const token = jwt.sign({ email }, secret, { expiresIn });

    res.json({ token });
});


module.exports = router;
