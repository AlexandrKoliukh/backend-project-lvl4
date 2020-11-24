exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('tasks')
    .del()
    .then(() => {
      return knex('tasks').insert([
        {
          name: 'Foo',
          description: '123 123 123',
          statusId: 1,
          creatorId: 1,
          executorId: 1,
        },
        {
          name: 'Bar',
          description: '123 123 123',
          statusId: 2,
          creatorId: 1,
          executorId: 2,
        },
        {
          name: 'Baz',
          description: '123 123 123',
          statusId: 3,
          creatorId: 2,
          executorId: null,
        },
      ]);
    });
};

// exports.seed = () => {};
