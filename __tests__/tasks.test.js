// @ts-check

import faker from 'faker';
import _ from 'lodash';
import app from '../server/index.js';
import { testUser } from '../__fixtures__/user';

describe('task crud', () => {
  let server;
  let Model;
  let cookies;
  let testTask;

  beforeAll(async () => {
    server = await app();
    await server.objection.knex.migrate.latest();
    await server.objection.knex.seed.run();

    Model = server.objection.models.task;

    testTask = {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      statusId: 1,
      creatorId: 1,
      labels: ['1', '2'],
    };

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: { user: testUser },
    });

    await server
      .inject({
        method: 'POST',
        url: '/session',
        payload: { user: testUser },
      })
      .then((res) => {
        const sessionCookie = _.find(res.cookies, { name: 'session' });
        cookies = {
          [sessionCookie.name]: sessionCookie.value,
        };
      });
  });

  afterAll(() => {
    server.close();
  });

  test('Task GET', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/tasks',
      cookies,
    });
    expect(res.statusCode).toBe(200);
  });

  test('Task POST', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/tasks',
      payload: { task: testTask },
      cookies,
    });
    const createdTask = await Model.query().findOne({
      name: testTask.name,
    });

    testTask = {
      ...testTask,
      id: createdTask.id,
    };

    expect(createdTask.name).toEqual(testTask.name);
    expect(createdTask.statusId).toEqual(testTask.statusId);
    expect(createdTask.creatorId).toEqual(testTask.creatorId);
    expect(res.statusCode).toBe(302);
  });

  test('Task PATCH', async () => {
    const newName = `TEST_${testTask.name}`;
    const newTask = Model.fromJson({
      ...testTask,
      name: newName,
    });

    const res = await server.inject({
      method: 'PATCH',
      url: `/tasks/${testTask.id}`,
      payload: {
        task: newTask,
      },
      cookies,
    });

    const updatedTask = await Model.query().findOne({
      id: testTask.id,
    });

    testTask = {
      ...testTask,
      name: updatedTask.name,
    };

    expect(updatedTask.name).toEqual(newName);
    expect(res.statusCode).toBe(302);
  });

  test('Task DELETE', async () => {
    await server.inject({
      method: 'delete',
      url: `/tasks/${testTask.id}`,
      cookies,
    });

    const task = await Model.query().findOne({ name: testTask.name });
    expect(task).toBeUndefined();
  });
});
