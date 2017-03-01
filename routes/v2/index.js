'use strict';

const router = require('express').Router();
const controller = require('../../controllers/index.js');
const v2 = require('../../controllers/v2.js');
const ds = require('../../controllers/ds.js');
const gc = require('../../controllers/gc.js');


router.post('/login', v2.login);
router.use('/login', controller.badRequest);

router.use(v2.auth);

router.get('/structure',
  v2.structCache,
  ds.getStructure,
  gc.getStructure,
  v2.structMerge,
  v2.structCacheResponse);

router.get('/structure/refresh',
  ds.getStructure,
  gc.getStructure,
  v2.structMerge,
  v2.structCacheResponse);

router.use('/ds', require('./ds.js'));
router.use('/gc', require('./gc.js'));

router.use(controller.badRequest);


module.exports = router;
