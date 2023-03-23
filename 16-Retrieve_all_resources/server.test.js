const request = require('supertest');
const app = require('./server.js');

describe('GET /', () => {
  it('responds with a JSON message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello, world!' });
    expect(response.header['content-type']).toMatch(/json/);
  });
});
