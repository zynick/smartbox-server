'use strict';

const router = require('express').Router();
const gc = require('../../controllers/gc.js');


router.get('/structure',
  gc.getStructure,
  gc.getStructureResponse);

router.post('/command',
  gc.postCommand,
  gc.postCommandResponse);


module.exports = router;
