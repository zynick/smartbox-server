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

router.use('/v1', require('./v1'));

module.exports = router;
