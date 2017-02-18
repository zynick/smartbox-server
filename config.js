'use strict';

const {
  JWT_SECRET = 'smartbox is the future',
  JWT_EXPIRE = '1d',

  LOGIN_EMAIL = 'dev@smartboxasia.com',
  LOGIN_PASSWORD = 'ilovesmartbox',

  DS_HOST = 'localhost',
  DS_PORT = 3000,

  GC_HOST = 'localhost',
  GC_PORT = 3001,

  NODE_ENV = 'development',
  PORT = 3030
} = process.env;

module.exports = {
  JWT_SECRET,
  JWT_EXPIRE,

  LOGIN_EMAIL,
  LOGIN_PASSWORD,

  DS_HOST,
  DS_PORT,

  GC_HOST,
  GC_PORT,

  NODE_ENV,
  PORT
};