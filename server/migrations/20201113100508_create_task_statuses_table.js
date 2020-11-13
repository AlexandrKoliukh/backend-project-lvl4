// @ts-check

exports.up = (knex) =>
  knex.schema.createTable('task_statuses', (table) => {
    table.increments('id').primary();
    table.string('name');
  });

exports.down = (knex) => knex.schema.dropTable('task_statuses');
