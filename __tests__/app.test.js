// @ts-check

import getApp from '../server/index.js';

describe('requests', () => {
  let app;

  beforeAll(() => {
    app = getApp();
  });

  afterAll(() => {
    app.close();
  });

  it('GET 200', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(res.statusCode).toBe(200);
  });

  it('GET 404', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/wrong-path',
    });
    expect(res.statusCode).toBe(404);
  });

  test.each(['tasks', 'labels', 'taskStatuses'])(
    'GET 302 %s',
    async (route) => {
      const res = await app.inject({
        method: 'GET',
        url: app.reverse(route),
      });
      expect(res.statusCode).toBe(302);
    }
  );
});
