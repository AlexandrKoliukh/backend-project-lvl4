exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('task_statuses')
    .del()
    .then(() => {
      return knex('task_statuses').insert([
        { id: 1, name: 'на тестировании' },
        { id: 2, name: 'в работе' },
        { id: 3, name: 'новый' },
        { id: 4, name: 'завершен' },
      ]);
    });
};
