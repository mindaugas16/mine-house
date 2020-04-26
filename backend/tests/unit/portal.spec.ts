import app from '../../src/app';

const supertest = require('supertest');
const request = supertest(app);

describe('GET Endpoints', () => {
  it('should return status code 200', async () => {
    const res = await request.get('/api/portals');
    expect(res.status).toEqual(200);
  });
});
