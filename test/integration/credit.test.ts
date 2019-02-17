import * as supertest from 'supertest';
import seedDb from '../../scripts/database-seed/write';
import unSeedDb from '../../scripts/database-seed/delete';
const request = supertest('localhost:3600');

// console.log(app);
beforeAll(async () => {
    console.log('injecting data on mongodb');
    try {
        const seed = await seedDb();
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


describe('POST /transaction/:transactionId', () => {
    it('Should return 200 - correct payload', () => {
        return request
            .post(`/credit/transaction/5c0a5df2ac610c06d297d3c3`)
            .expect(200, 'ok');
    });

    it('Should return 404 - wrong payload', () => {
        return request
            .post(`/credit/transaction/5b9f519cf772220012d9951c2`)
            .expect(404, 'not found');
    });

    it('Should return 404 - no transaction', () => {
        return request
            .post(`/credit/transaction/5b9f519cf772220012d9951c`)
            .expect(404, 'not found');
    });
});
