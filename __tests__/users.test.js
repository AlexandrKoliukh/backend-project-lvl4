// @ts-check

import _ from 'lodash';
import app from '../server/index.js';
import encrypt from '../server/lib/secure.js';
import { testUser as initTestUser } from '../__fixtures__/user';

describe('user crud', () => {
  let server;
  let testUser;
  let Model;

  beforeAll(async () => {
    server = await app();
    await server.objection.knex.migrate.latest();
    await server.objection.knex.seed.run();

    testUser = _.cloneDeep(initTestUser);

    Model = server.objection.models.user;
  });

  afterAll(() => {
    server.close();
  });

  test('User GET', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users',
    });
    expect(res.statusCode).toBe(200);
  });

  test('User POST', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users',
      payload: { user: testUser },
    });
    const createdUser = await Model.query().findOne({ email: testUser.email });
    testUser = {
      ...testUser,
      id: createdUser.id,
    };

    expect(createdUser.email).toEqual(testUser.email);
    expect(createdUser.passwordDigest).toEqual(encrypt(testUser.password));
    expect(res.statusCode).toBe(302);
  });

  test('User PATCH', async () => {
    const newEmail = `TEST_${testUser.email}`;
    const newUser = Model.fromJson({
      ...testUser,
      email: newEmail,
    });

    const res = await server.inject({
      method: 'PATCH',
      url: `/users/${testUser.id}`,
      payload: {
        user: newUser,
      },
    });

    const updatedUser = await Model.query().findOne({ id: testUser.id });

    testUser = {
      ...testUser,
      email: updatedUser.email,
    };

    expect(updatedUser.email).toEqual(newEmail);
    expect(res.statusCode).toBe(302);
  });

  test('User DELETE', async () => {
    await server.inject({
      method: 'delete',
      url: `/users/${testUser.id}`,
    });

    const user = await Model.query().findOne({ email: testUser.email });
    expect(user).toBeUndefined();
  });
});
