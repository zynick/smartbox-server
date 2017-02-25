'use strict';

const http = require('http');


const _responseFunction = next =>
  res => {
    let data = '';
    res
      .on('data', d => data += d)
      .on('end', () => {
        try {
          res.body = JSON.parse(data);
        } catch (e) {
          res.body = data;
        }
        next(null, res);
      })
      .on('error', next);
  };

const _socketFunction = next =>
  socket => {
    socket.setTimeout(30 * 1000); // 30 seconds;
    socket.on('timeout', () => {
      const err = new Error(`request timeout: ${url}`);
      err.status = 504;
      next(err);
    });
  };

const get = (url, next) => {
  http
    .get(url, _responseFunction(next))
    .on('error', next)
    .on('socket', _socketFunction(next));
};

const post = (hostname, port, path, json, next) => {

  const postData = JSON.stringify(json);

  const options = {
    hostname,
    port,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http
    .request(options, _responseFunction(next))
    .on('error', next)
    .on('socket', _socketFunction(next));

  req.write(postData);
  req.end();
};


module.exports = {
  get,
  post
};
