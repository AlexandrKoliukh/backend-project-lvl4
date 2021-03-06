// @ts-check

exports.up = (knex) =>
  knex.schema.createTable('tasks_labels', (table) => {
    table
      .integer('task_id')
      .unsigned()
      .references('tasks.id')
      .onDelete('CASCADE');
    table
      .integer('label_id')
      .unsigned()
      .references('labels.id')
      .onDelete('CASCADE');
  });

exports.down = (knex) => knex.schema.dropTable('tasks_labels');
