import supertest from 'supertest';
const request = supertest('localhost:7777');
import seedDb from '../../scripts/database-seed/insert';
import unSeedDb from '../../scripts/database-seed/delete';

beforeAll(async () => {
  console.log('inserting data on mongodb');
  try {
    await seedDb();
    console.log('ok seed complete');
    return true;
  } catch (err) {
    console.log('seed failed', err);
    return false;
  }
}, 4000);

afterAll(async () => {
  console.log('deleting data from mongodb');
  await unSeedDb();
  console.log('done');
  return true;
}, 4000);


describe('GET /api/docs', () => {
  it('Should return 200 - correct payload', () => {
    return request
      .get('/api/docs')
        .expect(200);
  });
});