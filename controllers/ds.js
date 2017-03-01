'use strict';

const { get, post } = require('../lib/http');
const { DS_HOST, DS_PORT } = require('../config.js');


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

    req.ds = body;
    next();
  };
};

const getStructure = (req, res, next) => {
  get(`http://${DS_HOST}:${DS_PORT}/v2/structure`, _httpResHandler(req, next));
};

const getStructureResponse = (req, res) => {
  return res.json(req.ds);
};

const postApi = (req, res, next) => {
  post(DS_HOST, DS_PORT, '/v2/api', req.body, _httpResHandler(req, next));
};

const postApiResponse = (req, res) => {
  res.json(req.ds);
};


module.exports = {
  getStructure,
  getStructureResponse,
  postApi,
  postApiResponse
};
