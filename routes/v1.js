'use strict';

const router = require('express').Router();
const controller = require('../controllers/index.js');
const v1 = require('../controllers/v1.js');

router.post('/login', v1.login);

router.use(v1.auth);
router.use('/ds/zones', v1.dsGetZones);
router.use('/gc/settings', v1.gcGetSettings);
router.use(controller.badRequest)

module.exports = router;
