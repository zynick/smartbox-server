'use strict';

const router = require('express').Router();
const httpGet = require('../../helpers/httpGet');
const { host, port } = require('../../config.json')['ha-gc'];
const url = `http://${host}:${port}`;


router.get('/settings', (req, res, next) => {
    httpGet(`${url}/v1/settings`, (err, httpRes) => {
        if (err) {
            return next(err);
        }
        res.status(httpRes.statusCode).json(httpRes.body);
    });
});


module.exports = router;
