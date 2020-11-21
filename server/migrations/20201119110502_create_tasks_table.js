// @ts-check

exports.up = (knex) =>
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.text('description');
    table
      .integer('status_id')
      .unsigned()
      .references('id')
      .inTable('task_statuses')
      .index();
    table
      .integer('executor_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .index();
    table
      .integer('creator_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .index();
  });

exports.down = (knex) => knex.schema.dropTable('tasks');
