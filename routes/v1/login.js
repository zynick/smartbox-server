'use strict';

const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { jwtSecret, login } = require('../../config.json');

// login
router.get('/', (req, res, next) => {

    const { email, password } = req.query;

    if (email !== login.email || password !== login.password) {
        const err = new Error('Invalid credentials');
        err.status = 400;
        return next(err);
    }

    const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1d' });

    res.json({ token });

});


module.exports = router;
