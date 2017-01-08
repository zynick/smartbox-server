'use strict';

const router = require('express').Router();

router.use('/getStructure', require('./getStructure'));

module.exports = router;