// @ts-check

import encrypt from '../server/lib/secure.js';
import { getUser } from '../__fixtures__/entitiesData';
import getApp from '../server';

describe('USERS', () => {
  let testUser;
  let Model;
  let app;

  beforeEach(async () => {
    app = await getApp();
    await app.objection.knex.migrate.latest();

    Model = app.objection.models.user;
    testUser = getUser();
  });

  afterEach(() => {
    app.close();
  });

  test(`GET users`, async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse('users'),
    });
    expect(res.statusCode).toBe(200);
  });

  test(`POST users`, async () => {
    const res = await app.inject({
      method: 'POST',
      url: app.reverse('users/create'),
      payload: { user: testUser },
    });
    const createdUser = await Model.query().findOne({ email: testUser.email });

    expect(res.statusCode).toBe(302);
    expect(createdUser.email).toEqual(testUser.email);
    expect(createdUser.passwordDigest).toEqual(encrypt(testUser.password));
  });

  test(`PATCH users`, async () => {
    const inserted = await Model.query().insert(testUser);
    const newKey = `TEST_${inserted.email}`;
    const newData = {
      ...inserted,
      email: newKey,
    };
    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse(`users/update`, { id: inserted.id }),
      payload: {
        user: newData,
        password: '123',
      },
    });

    const updated = await Model.query().findOne({
      id: inserted.id,
    });

    expect(res.statusCode).toBe(302);
    expect(updated.email).toEqual(newData.email);
    expect(updated.passwordDigest).toEqual(encrypt('123'));
  });

  test(`DELETE users`, async () => {
    const inserted = await Model.query().insert(testUser);
    await app.inject({
      method: 'delete',
      url: app.reverse(`users/delete`, { id: inserted.id }),
    });
    const deleted = await Model.query().findOne({ id: inserted.id });

    expect(deleted).toBeUndefined();
  });
});
