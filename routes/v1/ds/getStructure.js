'use strict';

const express = require('express');
const http = require('http');
const router = express.Router();
const { host, port } = require('../../../config.json')['ha-ds'];
const url = `http://${host}:${port}`;

const httpGet = (url, next) => {
    http
        .get(url, (res) => {
            let data = '';
            res
                .on('data', d => data += d)
                .on('end', () => {
                    try {
                        res.body = JSON.parse(data);
                    } catch (e) {
                        res.body = data;
                    }
                    next(null, res);
                })
                .on('error', next);
        })
        .on('error', next)
        .on('socket', (socket) => {
            socket.setTimeout(30 * 1000); // 30 seconds;
            socket.on('timeout', () => {
                const err = new Error(`request timeout: ${url}`);
                err.status = 504;
                next(err);
            });
        });
};


router.get('/', (req, res, next) => {
    httpGet(`${url}/v2/getStructure`, (err, httpRes) => {
        if (err) {
            return next(err);
        }
        res.status(httpRes.statusCode).json(httpRes.body);
    });
});

module.exports = router;
