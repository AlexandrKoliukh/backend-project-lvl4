// @ts-check

const path = require('path');

const migrations = {
  directory: path.resolve('server', 'migrations'),
};
const seeds = {
  directory: path.resolve('server', 'seeds'),
};

const common = {
  migrations,
  seeds,
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    ...common,
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    debug: false,
    ...common,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ...common,
  },
};
