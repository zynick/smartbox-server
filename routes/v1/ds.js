'use strict';

const router = require('express').Router();
const httpGet = require('../../helpers/httpGet');
const { host, port } = require('../../config.json')['ha-ds'];
const url = `http://${host}:${port}`;


router.get('/structures', (req, res, next) => {
    httpGet(`${url}/v2/getStructure`, (err, httpRes) => {
        if (err) {
            return next(err);
        }
        res.status(httpRes.statusCode).json(httpRes.body);
    });
});


module.exports = router;
