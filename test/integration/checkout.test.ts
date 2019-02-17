import * as supertest from 'supertest';
import seedDb from '../../scripts/database-seed/write';
import unSeedDb from '../../scripts/database-seed/delete';
const request = supertest('localhost:3600');
import { ACCOUNT_ID, SUBSCRIPTION_ID, PAYMENT_ID } from '../../scripts/database-seed/ids';
import moment = require('moment');

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

describe('POST /checkout/current/payment/method', () => {
    it('Should return 200 - correct payload', () => {
        return request
            .post('/checkout/current/payment/method')
            .send({
                transactionType: 'recurring',
                accountId: ACCOUNT_ID,
                planId: '587506529df8c5001080a3f5',
                vatRate: '21',
                transactionId: '581b5d8759321c24fc146f57',
                discountId: '5c07a7463c0dde0012e7c682',
                scheduledTransactionId: '582b5d8759321c14fc646f51',
                paymentMethodId: PAYMENT_ID,
                amount: '240.79',
                settlementAmount: '',
                creditAmount: '',
                currency: 'EUR',
                customerName: 'T A Berhe',
                invoiceNumber: 'EUV0000028119',
                transactionKey: '',
                payerHash: '14579cecee9ac98264461fb97fdab7bcb097ec7d37f2000c62a2f9cb197a5f0f249221b3f26eebeebc591692ea3b2abd4af8a125a8ce33d23fcd2a140e6e0bed',
                buckarooPaymentMethod: '',
                period: 'month',
                billingCycle: 'month',
                recurrent: 'True',
                statusCode: '492',
                statusCodeDetail: 'S990',
                statusMessage: 'The request was successful.',
                test: 'false',
                timestamp: '2018-03-23 15:10:46',
                signature: '1d1f31c7d3e3904edf3d536dddeb8769312196d8',
                cardMeta: '',
                collectionDate: '',
                startDate: moment(),
                endDate: moment().add(1, 'M'),
                manual: ''
            })
            .expect(200, 'ok');
    });
});
