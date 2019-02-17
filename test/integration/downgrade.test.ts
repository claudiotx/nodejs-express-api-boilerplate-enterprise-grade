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

let subId: string;

describe('POST /downgrade/subscription', () => {
    it('Should return 200 - correct payload', () => {
        return request
            .post('/downgrade/subscription')
            .send({
                accountId: '5b9f519cf772220012d9951e',
                planId: '582b5d8759321c14fc646f57',
                period: 'month',
                billingCycle: 'month',
                vatRate: '21'
            })
            .expect(200)
            .then((res) => {
                subId = res.body.sub;
            });
    });

    it('Should return 400 - no payload', () => {
        return request
            .post('/downgrade/subscription')
            .expect(400, 'bad request');
    });

    it('Should return 404 - wrong payload', () => {
        return request
            .post('/downgrade/subscription')
            .send({
                accountId: '5b9f519cf772220012d9951e2'
            })
            .expect(404, 'not found');
    });

    it('Should return 404 - no account', () => {
        return request
            .post('/downgrade/subscription')
            .send({
                accountId: '5b9f519cf772220012d9951c'
            })
            .expect(404, 'not found');
    });

    it('Should return 400 - unsupported content-type', () => {
        return request
            .post('/downgrade/subscription')
            .field('accountId', '5b9f519cf772220012d9951e')
            .set('Content-Type', 'text/html')
            .expect(400, 'bad request');
    });
});

describe('POST /downgrade/subscription/trigger/:subscriptionId', () => {
    it('Should return 200 - correct payload', () => {
        return request
            .post(`/downgrade/subscription/trigger/${subId}`)
            .expect(200, 'ok');
    });

    it('Should return 404 - wrong payload', () => {
        return request
            .post(`/downgrade/subscription/trigger/${subId}2`)
            .expect(404, 'not found');
    });

    it('Should return 404 - no subscription', () => {
        return request
            .post(`/downgrade/subscription/trigger/5b9f519cf772220012d9951c`)
            .expect(404, 'not found');
    });
});

describe('POST /downgrade/undo/:downgradedSubscriptionId', () => {
    it('Should return 200 - correct payload', () => {
        return request
            .post(`/downgrade/undo/${subId}`)
            .expect(200, 'ok');
    });

    it('Should return 404 - wrong payload', () => {
        return request
            .post(`/downgrade/subscription/trigger/${subId}2`)
            .expect(404, 'not found');
    });

    it('Should return 404 - no subscription', () => {
        return request
            .post(`/downgrade/subscription/trigger/5b9f519cf772220012d9951c`)
            .expect(404, 'not found');
    });
});
