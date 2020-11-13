// @ts-check

const path = require('path');

const migrations = {
  directory: path.resolve('server', 'migrations'),
};
const seeds = {
  directory: path.resolve('server', 'seeds'),
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    migrations,
    seeds,
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    debug: false,
    migrations,
    seeds,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations,
    seeds,
  },
};
