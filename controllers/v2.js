'use strict';

const jwt = require('jsonwebtoken');
const { get, post } = require('../lib/http');
const {
  LOGIN_EMAIL,
  LOGIN_PASSWORD,
  JWT_SECRET,
  JWT_EXPIRE
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



const structCache = (req, res, next) => {
  // get cache if exist
  if (structureCache) {
    res.json(structureCache);
  } else {
    next();
  }
};

const structMerge = (req, res, next) => {
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

const structCacheResponse = (req, res) => {
  structureCache = req.structure;
  res.json(req.structure);
};


module.exports = {
  auth,
  login,
  structCache,
  structMerge,
  structCacheResponse
};
