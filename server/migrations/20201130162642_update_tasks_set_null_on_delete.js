// @ts-check

exports.up = (knex) =>
  knex.schema.alterTable('tasks', (table) => {
    table
      .integer('status_id')
      .unsigned()
      .references('id')
      .inTable('task_statuses')
      .index()
      .onDelete('SET NULL')
      .alter();
    table
      .integer('executor_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .index()
      .onDelete('SET NULL')
      .alter();
    table
      .integer('creator_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .index()
      .onDelete('SET NULL')
      .alter();
  });

exports.down = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table
      .integer('status_id')
      .unsigned()
      .references('id')
      .inTable('task_statuses')
      .index()
      .alter();

    table
      .integer('executor_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .index()
      .alter();
    table
      .integer('creator_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .index()
      .alter();
  });
