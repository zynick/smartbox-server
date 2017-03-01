'use strict';

const router = require('express').Router();
const ds = require('../../controllers/ds.js');


router.get('/structure',
  ds.getStructure,
  ds.getStructureResponse);

router.post('/api',
  ds.postApi,
  ds.postApiResponse);


module.exports = router;
