'use strict';

const http = require('http');

module.exports = (url, next) => {
  http
    .get(url, res => {
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
    })
    .on('error', next)
    .on('socket', socket => {
      socket.setTimeout(30 * 1000); // 30 seconds;
      socket.on('timeout', () => {
        const err = new Error(`request timeout: ${url}`);
        err.status = 504;
        next(err);
      });
    });
};
