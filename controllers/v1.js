'use strict';

const async = require('async');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { get } = require('../lib/http');
const {
  LOGIN_EMAIL,
  LOGIN_PASSWORD,
  JWT_SECRET,
  JWT_EXPIRE,
  DS_HOST,
  DS_PORT,
  GC_HOST,
  GC_PORT
} = require('../config.js');


const _get = (url, res, next) => {
  get(url, (err, httpRes) => {
    if (err) {
      return next(err);
    }
    res
      .status(httpRes.statusCode)
      .json(httpRes.body);
  });
};

const auth = (req, res, next) => {

  const { authorization = '' } = req.headers;
  const token = authorization.split(' ')[1];

  if (!token) {
    const err = new Error('Token not found');
    err.status = 401;
    return next(err);
  }

  jwt.verify(token, JWT_SECRET,
    (err, decoded) => {
      if (err) {
        const err2 = new Error('Invalid token');
        err2.status = 401;
        return next(err2);
      }

      req.jwt = decoded;
      next();
    });
};

const login = (req, res, next) => {

  const { email, password } = req.body;

  if (email !== LOGIN_EMAIL || password !== LOGIN_PASSWORD) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    return next(err);
  }

  const payload = { email };
  const options = { expiresIn: JWT_EXPIRE };
  const token = jwt.sign(payload, JWT_SECRET, options);

  res.json({ token });
};

const dsGetZones = (req, res, next) =>
  _get(`http://${DS_HOST}:${DS_PORT}/v2/zones`, res, next);

const dsGetStructure = (req, res, next) =>
  _get(`http://${DS_HOST}:${DS_PORT}/v2/structure`, res, next);

const gcGetStructure = (req, res, next) =>
  _get(`http://${GC_HOST}:${GC_PORT}/v1/structure`, res, next);



const structure = (req, res, next) => {
  res.json('not implemented yet');
  // get structure from structure.json.
  // if structure.json not found, 
  //   1. get structure from ds & gc, 
  //   2. merge ds & gc structure,
  //   3. save it into structure.json
  //   4. return merged structure
};

const stackGetDsStructure = (req, res, next) => {
  get(`http://${DS_HOST}:${DS_PORT}/v2/structure`,
    (err, httpRes) => {
      if (err) {
        return next(err);
      }
      if (httpRes.statusCode !== 200) {
        const err2 = new Error(`${httpRes.statusCode}: ${JSON.stringify(httpRes.body)}`);
        err2.status = httpRes.statusCode;
        return next(err2);
      }
      req.ds = httpRes.body;
      next(null, req, res);
    });
}

const stackGetGcStructure = (req, res, next) => {
  get(`http://${GC_HOST}:${GC_PORT}/v1/structure`,
    (err, httpRes) => {
      if (err) {
        return next(err);
      }
      if (httpRes.statusCode !== 200) {
        const err2 = new Error(`${httpRes.statusCode}: ${JSON.stringify(httpRes.body)}`);
        err2.status = httpRes.statusCode;
        return next(err2);
      }
      req.gc = httpRes.body;
      next(null, req, res);
    });
};

const stackMergeStructure = (req, res, next) => {
  const { ds, gc } = req;

  console.log(`ds:`)
  console.log(JSON.stringify(ds,null,2));
  console.log(`gc:`)
  console.log(JSON.stringify(gc,null,2));

  let structure = [];
  let exists = {};

  ds.forEach((zone, idx) => {
    const { name } = zone;
    let items = [];
    let _zone = { name, items };

    exists[name] = idx;

    zone.groups.forEach(group => {
      group.type = 'digitalstrom';
      items.push(group);
    });

    structure.push(_zone);
  });

  gc.forEach(zone => {
    const { name } = zone;
    let items, _zone;

    const idx = exists[name];
    if (idx === undefined) {
      // append
      items = [];
      _zone = { name, items };
      structure.push(_zone);
    } else {
      // insert
      _zone = structure[idx];
      items = _zone.items;
    }

    zone.items.forEach(item => {
      item.type = 'globalcache';
      items.push(item);
    });
  });

  req.structure = structure;
  next(null, req, res);
};

const stackSaveFile = (req, res, next) => {
  const string = JSON.stringify(req.structure);
  fs.writeFile('structure.json', string,
    err => next(err, req, res));
};

const stackResponse = (req, res, next) => {
  res.json(req.structure);
};

const structureRefresh = (req, res, next) => {
  async.waterfall([
      next => next(null, req, res),
      stackGetDsStructure,
      stackGetGcStructure,
      stackMergeStructure,
      stackSaveFile,
      stackResponse
    ],
    next);
};


module.exports = {
  auth,
  login,
  dsGetZones,
  dsGetStructure,
  gcGetStructure,
  structure,
  structureRefresh
};
