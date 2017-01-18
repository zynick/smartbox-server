'use strict';

const router = require('express').Router();
const isProd = process.env.NODE_ENV === 'production';
const { version } = require('../package.json');


router.get('/', (req, res) => {
    res.json(`SMARTBOX API Server v${version}`);
});

router.use('/v1', require('./v1'));


/* 404 & Error Handlers */
router.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

router.use((err, req, res, next) => {
    let result = {
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
    };
    // hide stacktrace in production, show otherwise
    if (!isProd) {
        result.stack = err.stack;
    }
    res
        .status(result.status)
        .json({
            error: result
        });
});

module.exports = router;
