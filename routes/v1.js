'use strict';

const router = require('express').Router();
const controller = require('../controllers/index.js');
const v1 = require('../controllers/v1.js');

router.post('/login', v1.login);
router.use('/login', controller.badRequest);

router.use(v1.auth);

router.get('/ds/zones', v1.dsGetZones);
router.get('/ds/structure', v1.dsGetStructure);
router.get('/gc/structure', v1.gcGetStructure);

router.get('/structure', v1.structure);
router.get('/structure/refresh', v1.structureRefresh);

router.use(controller.badRequest);

module.exports = router;
