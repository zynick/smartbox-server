'use strict';

const jwt = require('jsonwebtoken');

const httpGet = require('../lib/httpGet');
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



const auth = (req, res, next) => {

  const token = req.query.token || req.body.token;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      const err2 = new Error(`Invalid token: ${err.message}`);
      err2.status = 400;
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
    err.status = 400;
    return next(err);
  }

  const payload = { email };
  const options = { expiresIn: JWT_EXPIRE };
  const token = jwt.sign(payload, JWT_SECRET, options);

  res.json({ token });
};

const dsGetZones = (req, res, next) => {

  httpGet(`http://${DS_HOST}:${DS_PORT}/v2/zones`, (err, httpRes) => {
    if (err) {
      return next(err);
    }
    res
      .status(httpRes.statusCode)
      .json(httpRes.body);
  });
};

const gcGetSettings = (req, res, next) => {

  httpGet(`http://${GC_HOST}:${GC_PORT}/v1/settings`, (err, httpRes) => {
    if (err) {
      return next(err);
    }
    res
      .status(httpRes.statusCode)
      .json(httpRes.body);
  });
};




module.exports = {
  auth,
  login,
  dsGetZones,
  gcGetSettings
};
