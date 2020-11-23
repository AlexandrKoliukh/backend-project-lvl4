// @ts-check

import faker from 'faker';
import _ from 'lodash';
import app from '../server/index.js';

describe('label crud', () => {
  let server;
  let testLabel;
  let Model;
  let testUser;
  let cookies;

  beforeAll(async () => {
    server = await app();
    await server.objection.knex.migrate.latest();
    await server.objection.knex.seed.run();

    testLabel = {
      name: faker.lorem.word(),
    };

    testUser = {
      email: faker.internet.email(),
      password: faker.internet.password(5),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    Model = server.objection.models.label;

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

  test('Label GET', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/labels',
      cookies,
    });
    expect(res.statusCode).toBe(200);
  });

  test('Label POST', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/labels',
      payload: { label: testLabel },
      cookies,
    });
    const createdLabel = await Model.query().findOne({
      name: testLabel.name,
    });

    testLabel = {
      ...testLabel,
      id: createdLabel.id,
    };

    expect(createdLabel.name).toEqual(testLabel.name);
    expect(res.statusCode).toBe(302);
  });

  test('Label PATCH', async () => {
    const newName = `TEST_${testLabel.name}`;
    const newLabel = Model.fromJson({
      ...testLabel,
      name: newName,
    });

    const res = await server.inject({
      method: 'PATCH',
      url: `/labels/${testLabel.id}`,
      payload: {
        label: newLabel,
      },
      cookies,
    });

    const updatedLabel = await Model.query().findOne({
      id: testLabel.id,
    });

    testLabel = {
      ...testLabel,
      name: updatedLabel.name,
    };

    expect(updatedLabel.name).toEqual(newName);
    expect(res.statusCode).toBe(302);
  });

  test('Label DELETE', async () => {
    await server.inject({
      method: 'delete',
      url: `/labels/${testLabel.id}`,
      cookies,
    });

    const user = await Model.query().findOne({ name: testLabel.name });
    expect(user).toBeUndefined();
  });
});
