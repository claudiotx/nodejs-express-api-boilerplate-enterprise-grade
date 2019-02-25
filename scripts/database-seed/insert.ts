import mongoose from 'mongoose';
import moment from 'moment';
import dotenv from 'dotenv';
import { SampleModel } from '../../src/models/sample.model';

// Environment Flags
if (!process.env.NODE_ENV) {
  dotenv.config({ path: './env/.env.development' });
} else if (process.env.NODE_ENV === 'staging') {
  dotenv.config({ path: './env/.env.staging' });
} else if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './env/.env.production' });
} else {
  dotenv.config({ path: './env/.env.development' });
}

const mockSample = {
  identifier: 'demo identifier'
}

const addSample = (): Promise<any> => {
  const sampleObj = new SampleModel(mockSample);
  console.log('saving sample');
  return sampleObj.save();
};

const init = () => {
  return new Promise((resolve, reject) => {
    console.log(`seeding... ${process.env}`, process.env.MONGODB_URI);
    mongoose.connect(process.env.MONGODB_URI, async (err) => {
      if (err) {
        throw err;
      }

      try {
        await addSample();
        // await addWathever();
        resolve(true);
      } catch (err) {
        console.log('error', err);
        reject();
      }
    });
  });
};

export default init;