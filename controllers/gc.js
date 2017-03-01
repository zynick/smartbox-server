'use strict';

const { get, post } = require('../lib/http');
const { GC_HOST, GC_PORT } = require('../config.js');


const _httpResHandler = (req, next) => {
  return (err, httpRes) => {
    if (err) {
      return next(err);
    }

    const { statusCode, body } = httpRes;
    if (statusCode < 200 || statusCode > 299) {
      err = new Error(`${statusCode}: ${JSON.stringify(body)}`);
      err.status = statusCode;
      return next(err);
    }

    req.gc = body;
    next();
  };
};

const getStructure = (req, res, next) => {
  get(`http://${GC_HOST}:${GC_PORT}/v2/structure`, _httpResHandler(req, next));
};

const getStructureResponse = (req, res) => {
  return res.json(req.gc);
};

const postCommand = (req, res, next) => {
  post(GC_HOST, GC_PORT, '/v2/command', req.body, _httpResHandler(req, next));
};

const postCommandResponse = (req, res) => {
  res.json(req.gc);
};


module.exports = {
  getStructure,
  getStructureResponse,
  postCommand,
  postCommandResponse
};
