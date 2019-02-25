import supertest from 'supertest';
const request = supertest('localhost:7777');
// https://jestjs.io/

beforeEach(async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
});


describe('GET health endpoint', () => {
  it('should return 200 OK', () => {
    return request.get('/')
      .expect(200);
      // .expect('Cache-Control', 'no-cache');
      // .expect('Content-Length', '0')
      // .expect('Pragma', 'no-cache')
      // .expect('Referrer-Policy', 'same-origin')
      // .expect('X-Content-Type-Options', 'nosniff')
      // .expect('X-Cache', 'Miss from cloudfront');
  });
});