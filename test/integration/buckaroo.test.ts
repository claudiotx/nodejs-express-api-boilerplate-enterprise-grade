import * as supertest from 'supertest';
import seedDb from '../../scripts/database-seed/write';
import unSeedDb from '../../scripts/database-seed/delete';
const request = supertest('localhost:3600');
import { ACCOUNT_ID, SUBSCRIPTION_ID, PAYMENT_ID } from '../../scripts/database-seed/ids';

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

describe('POST Buckaroo Callback handler endpoints', () => {
  it('Test Recurring Failed - Callback', () => {
    return request.post('/buckaroo/callback')
      .send({
        ADD_ACCOUNT_ID: ACCOUNT_ID,
        ADD_PAYMENT_ID: PAYMENT_ID,
        ADD_PLAN_ID: '582b5d8759321c24fc146f57',
        ADD_SCHEDULED_TRANSACTION_ID: '582b5d8759321c14fc646f51',
        ADD_SUBSCRIPTION_ID: SUBSCRIPTION_ID,
        ADD_TRANSACTION_ID: '581b5d8759321c24fc146f57',
        ADD_TRANSACTION_TYPE: 'recurring',
        BRQ_AMOUNT: '240.79',
        BRQ_CURRENCY: 'EUR',
        BRQ_CUSTOMER_NAME: 'T A Berhe',
        BRQ_INVOICENUMBER: 'EUV0000028119',
        BRQ_ISSUING_COUNTRY: 'GB',
        BRQ_MUTATIONTYPE: 'Processing',
        BRQ_PAYER_HASH: '14579cecee9ac98264461fb97fdab7bcb097ec7d37f2000c62a2f9cb197a5f0f249221b3f26eebeebc591692ea3b2abd4af8a125a8ce33d23fcd2a140e6e0bed',
        BRQ_PAYMENT: 'EED8027DDE7248C8B9D5A4E07A2E3E18',
        BRQ_RECURRING: 'True',
        BRQ_SERVICE_VISA_CARDEXPIRATIONDATE: '2019-10',
        BRQ_SERVICE_VISA_CARDNUMBERENDING: '9263',
        BRQ_SERVICE_VISA_MASKEDCREDITCARDNUMBER: '486483******9263',
        BRQ_SIGNATURE: '1d1f31c7d3e3904edf3d536dddeb8769312196d8',
        BRQ_STATUSCODE: '492',
        BRQ_STATUSCODE_DETAIL: 'S990',
        BRQ_STATUSMESSAGE: 'The request was successful.',
        BRQ_TEST: 'false',
        BRQ_TIMESTAMP: '2018-03-23 15:10:46',
        BRQ_TRANSACTIONS: '62BE40523AFA4FAA94DCD8A15967C6B9',
        BRQ_TRANSACTION_METHOD: 'visa',
        BRQ_TRANSACTION_TYPE: 'V044',
        BRQ_WEBSITEKEY: 'AbLpHSLd9g'
      })
      .set('Accept', 'application/json')
      .expect(200);
  });
});