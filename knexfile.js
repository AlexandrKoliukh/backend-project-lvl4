// @ts-check

const path = require('path');
const { knexSnakeCaseMappers } = require('objection');

const migrations = {
  directory: path.resolve('server', 'migrations'),
};

const common = {
  migrations,
  ...knexSnakeCaseMappers(),
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    seeds: {
      directory: path.resolve('server', 'seeds/dev'),
    },
    ...common,
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    debug: false,
    seeds: {
      directory: path.resolve('server', 'seeds/test'),
    },
    ...common,
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    seeds: {
      directory: path.resolve('server', 'seeds/prod'),
    },
    ...common,
  },
};
