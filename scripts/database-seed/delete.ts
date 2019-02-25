import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { SampleModel } from '../../src/models/sample.model';

dotenv.config({ path: './env/.env.development' });

const identifier = `demo identifier`;

const removeSample = () => {
  return SampleModel.remove({identifier: identifier});
};

const init = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGODB_URI, async (err) => {
      if (err) {
        console.log('not connected to mongodb');
        throw err;
      }

      try {
        await removeSample();
        resolve(true);
      } catch (err) {
        console.log('error', err);
        reject();
      }
    });
  });
};

export default init;
