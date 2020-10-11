// @ts-check

import app from '../server/index.js';

describe('user requests', () => {
  let server;

  beforeAll(() => {
    server = app();
  });

  it('users GET 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users',
    });
    expect(res.statusCode).toBe(200);
  });

  afterAll(() => {
    server.close();
  });
});
