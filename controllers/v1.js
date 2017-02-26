'use strict';

const async = require('async');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { get, post } = require('../lib/http');
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


let structureCache;


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

const postDsApi = (req, res, next) => {
  post(DS_HOST, DS_PORT, '/v2/api', req.body,
    (err, httpRes) => {
      if (err) {
        return next(err);
      }
      if (httpRes.statusCode !== 200) {
        err = new Error(`${httpRes.statusCode}: ${JSON.stringify(httpRes.body)}`);
        err.status = httpRes.statusCode;
        return next(err);
      }
      req.ds = httpRes.body;
      next();
    });
};

const postDsApiResponse = (req, res) => res.json(req.ds);

const structGetCacheIfExist = (req, res, next) => {
  if (structureCache) {
    res.json(structureCache);
  } else {
    next();
  }
};

const structGetDsStructure = (req, res, next) => {
  get(`http://${DS_HOST}:${DS_PORT}/v2/structure`,
    (err, httpRes) => {
      if (err) {
        return next(err);
      }
      if (httpRes.statusCode !== 200) {
        err = new Error(`${httpRes.statusCode}: ${JSON.stringify(httpRes.body)}`);
        err.status = httpRes.statusCode;
        return next(err);
      }
      req.ds = httpRes.body;
      next();
    });
}

const structGetGcStructure = (req, res, next) => {
  get(`http://${GC_HOST}:${GC_PORT}/v1/structure`,
    (err, httpRes) => {
      if (err) {
        return next(err);
      }
      if (httpRes.statusCode !== 200) {
        err = new Error(`${httpRes.statusCode}: ${JSON.stringify(httpRes.body)}`);
        err.status = httpRes.statusCode;
        return next(err);
      }
      req.gc = httpRes.body;
      next();
    });
};

const structMergeStructure = (req, res, next) => {
  const { ds, gc } = req;

  // TODO move this to lib
  let structure = [];
  let exists = {};

  ds.forEach((zone, idx) => {
    const { zoneID, name } = zone;
    let items = [];
    let _zone = { name, items };

    exists[name] = idx;

    zone.groups.forEach(group => {
      group.groupId = group.id;
      group.type = 'digitalstrom';
      group.zoneId = zoneID;
      delete group.id;
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
  next();
};

const structSaveCacheAndResponse = (req, res) => {
  structureCache = req.structure;
  res.json(req.structure);
};

const structDsResponse = (req, res) => res.json(req.ds);
const structGcResponse = (req, res) => res.json(req.gc);


module.exports = {
  auth,
  login,
  postDsApi,
  postDsApiResponse,
  structGetCacheIfExist,
  structGetDsStructure,
  structGetGcStructure,
  structMergeStructure,
  structSaveCacheAndResponse,
  structDsResponse,
  structGcResponse
};
