'use strict';

const router = require('express').Router();
const controller = require('../controllers/index.js');
const v1 = require('../controllers/v1.js');


router.post('/login', v1.login);
router.use('/login', controller.badRequest);

router.use(v1.auth);

router.post('/ds/api',
  v1.postDsApi,
  v1.postDsApiResponse);

router.get('/structure',
  v1.structGetCacheIfExist,
  v1.structGetDsStructure,
  v1.structGetGcStructure,
  v1.structMergeStructure,
  v1.structSaveCacheAndResponse);

router.get('/structure/refresh',
  v1.structGetDsStructure,
  v1.structGetGcStructure,
  v1.structMergeStructure,
  v1.structSaveCacheAndResponse);

router.get('/structure/ds',
  v1.structGetDsStructure,
  v1.structDsResponse);

router.get('/structure/gc',
  v1.structGetGcStructure,
  v1.structGcResponse);

router.use(controller.badRequest);


module.exports = router;
