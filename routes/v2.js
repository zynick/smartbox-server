'use strict';

const router = require('express').Router();
const controller = require('../controllers/index.js');
const v2 = require('../controllers/v2.js');


router.post('/login', v2.login);
router.use('/login', controller.badRequest);

router.use(v2.auth);

router.post('/ds/api',
  v2.postDsApi,
  v2.postDsApiResponse);

router.get('/structure',
  v2.structGetCacheIfExist,
  v2.structGetDsStructure,
  v2.structGetGcStructure,
  v2.structMergeStructure,
  v2.structSaveCacheAndResponse);

router.get('/structure/refresh',
  v2.structGetDsStructure,
  v2.structGetGcStructure,
  v2.structMergeStructure,
  v2.structSaveCacheAndResponse);

router.get('/structure/ds',
  v2.structGetDsStructure,
  v2.structDsResponse);

router.get('/structure/gc',
  v2.structGetGcStructure,
  v2.structGcResponse);

router.use(controller.badRequest);


module.exports = router;
