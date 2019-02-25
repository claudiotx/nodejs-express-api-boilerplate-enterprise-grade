import { Schema, model } from 'mongoose';
import SampleDoc from './sample.doc';
import updatedOnPlugin from './update-plugin';
const { ObjectId } = Schema.Types;

const SampleSchema: Schema = new Schema({
  identifier: {
    type: String
  },
  description: {
    type: String
  }
});

SampleSchema.plugin(updatedOnPlugin);

const SampleModel: any = model('sample', SampleSchema);
export { SampleModel };