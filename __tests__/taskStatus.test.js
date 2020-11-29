// @ts-check

import faker from 'faker';
import _ from 'lodash';
import app from '../server/index.js';

describe('task status crud', () => {
  let server;
  let testTaskStatus;
  let Model;
  let testUser;
  let cookies;

  beforeAll(async () => {
    server = await app();
    await server.objection.knex.migrate.latest();
    await server.objection.knex.seed.run();

    testTaskStatus = {
      name: faker.lorem.word(),
    };

    testUser = {
      email: faker.internet.email(),
      password: faker.internet.password(5),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    Model = server.objection.models.taskStatus;

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

  test('TaskStatus GET', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/task-statuses',
      cookies,
    });

    expect(res.statusCode).toBe(200);
  });

  test('TaskStatus POST', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/task-statuses',
      payload: { taskStatus: testTaskStatus },
      cookies,
    });
    const createdTaskStatus = await Model.query().findOne({
      name: testTaskStatus.name,
    });

    testTaskStatus = {
      ...testTaskStatus,
      id: createdTaskStatus.id,
    };

    expect(res.statusCode).toBe(302);
    expect(createdTaskStatus.name).toEqual(testTaskStatus.name);
  });

  test('TaskStatus PATCH', async () => {
    const newName = `TEST_${testTaskStatus.name}`;
    const newTaskStatus = Model.fromJson({
      ...testTaskStatus,
      name: newName,
    });

    const res = await server.inject({
      method: 'PATCH',
      url: `/task-statuses/${testTaskStatus.id}`,
      payload: {
        taskStatus: newTaskStatus,
      },
      cookies,
    });

    const updatedTaskStatus = await Model.query().findOne({
      id: testTaskStatus.id,
    });

    testTaskStatus = {
      ...testTaskStatus,
      name: updatedTaskStatus.name,
    };

    expect(res.statusCode).toBe(302);
    expect(updatedTaskStatus.name).toEqual(newName);
  });

  test('TaskStatus DELETE', async () => {
    await server.inject({
      method: 'delete',
      url: `/task-statuses/${testTaskStatus.id}`,
      cookies,
    });

    const user = await Model.query().findOne({ name: testTaskStatus.name });

    expect(user).toBeUndefined();
  });
});
