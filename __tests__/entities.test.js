// @ts-check

import _ from 'lodash';
import getApp from '../server/index.js';
import {
  getLabel,
  getTask,
  getTaskStatus,
  getUser,
} from '../__fixtures__/entitiesData';

let app;
let Model;
let cookies;

const tests = [
  {
    routesName: 'labels',
    modelName: 'label',
    createTestNames: ['name'],
    updateTestNames: ['name'],
    findKey: 'name',
    fakeData: getLabel(),
  },
  {
    routesName: 'taskStatuses',
    modelName: 'taskStatus',
    createTestNames: ['name'],
    updateTestNames: ['name'],
    findKey: 'name',
    fakeData: getTaskStatus(),
  },
  {
    routesName: 'tasks',
    modelName: 'task',
    createTestNames: ['name', 'statusId', 'creatorId'],
    updateTestNames: ['name'],
    findKey: 'name',
    fakeData: getTask(),
  },
].map((i) =>
  Object.assign(i, {
    toString() {
      return i.routesName;
    },
  })
);

describe.each(tests)('CRUD %s', (testProps) => {
  beforeEach(async () => {
    app = await getApp();
    await app.objection.knex.migrate.latest();
    Model = app.objection.models[testProps.modelName];
    const authUser = getUser();

    await app.inject({
      method: 'POST',
      url: '/users',
      payload: { user: authUser },
    });

    await app
      .inject({
        method: 'POST',
        url: '/session',
        payload: { user: authUser },
      })
      .then((res) => {
        const sessionCookie = _.find(res.cookies, { name: 'session' });
        cookies = {
          [sessionCookie.name]: sessionCookie.value,
        };
      });
  });

  afterEach(() => {
    app.close();
  });

  test(`GET ${testProps.routesName}`, async () => {
    const res = await app.inject({
      method: 'GET',
      url: app.reverse(testProps.routesName),
      cookies,
    });
    expect(res.statusCode).toBe(200);
  });

  test(`POST ${testProps.routesName}`, async () => {
    const res = await app.inject({
      method: 'POST',
      url: app.reverse(`${testProps.routesName}/create`),
      payload: { [testProps.modelName]: testProps.fakeData },
      cookies,
    });
    const created = await Model.query().findOne({
      [testProps.findKey]: testProps.fakeData[testProps.findKey],
    });

    expect(res.statusCode).toBe(302);
    testProps.createTestNames.forEach((name) => {
      expect(created[name]).toEqual(testProps.fakeData[name]);
    });
  });

  test(`PATCH ${testProps.routesName}`, async () => {
    const inserted = await Model.query().insert(testProps.fakeData);
    const newKey = `TEST_${inserted[testProps.findKey]}`;
    const newData = Model.fromJson({
      ...inserted,
      [testProps.findKey]: newKey,
    });
    const res = await app.inject({
      method: 'PATCH',
      url: app.reverse(`${testProps.routesName}/update`, { id: inserted.id }),
      payload: {
        [testProps.modelName]: newData,
      },
      cookies,
    });

    const updated = await Model.query().findOne({
      id: inserted.id,
    });

    expect(res.statusCode).toBe(302);
    testProps.updateTestNames.forEach((name) => {
      expect(updated[name]).toEqual(newData[name]);
    });
  });

  test(`DELETE ${testProps.routesName}`, async () => {
    const inserted = await Model.query().insert(testProps.fakeData);
    await app.inject({
      method: 'delete',
      url: app.reverse(`${testProps.routesName}/delete`, { id: inserted.id }),
      cookies,
    });
    const deleted = await Model.query().findOne({ id: inserted.id });

    expect(deleted).toBeUndefined();
  });
});
