// @ts-check

import faker from 'faker';
import app from '../server/index.js';

describe('user requests', () => {
  let server;
  let testUser;

  beforeAll(async () => {
    server = await app();
    testUser = {
      email: faker.internet.email(),
      password: faker.internet.password(5),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };
  });

  test('users GET 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users',
    });
    expect(res.statusCode).toBe(200);
  });
  /*

  test('get user register form', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users/new',
    });

    expect(res.statusCode).toBe(200);
  });

  test('create new user', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/users',
      payload: { user: testUser },
    });
    const createdUser = await User.query().findOne({ email: testUser.email });
    testUser = {
      ...testUser,
      id: createdUser.id,
    };

    expect(createdUser.email).toEqual(testUser.email);
    expect(createdUser.passwordDigest).toEqual(encrypt(testUser.password));
    expect(res.statusCode).toBe(302);
  });

  test('get user profile', async () => {
    const res = await server.inject({
      method: 'get',
      url: `/users/${testUser.id}`,
    });

    expect(res.statusCode).toBe(302);
  });

  test('delete user profile', async () => {
    await server.inject({
      method: 'delete',
      url: `/users/${testUser.id}`,
    });

    const user = await User.query().findOne({ email: testUser.email });
    expect(user).toBeUndefined();
  });
*/

  afterAll(() => {
    server.close();
  });
});
