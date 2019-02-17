import { Schema, model } from 'mongoose';
import FeedDoc from './feed.doc';
import updatedOnPlugin from './update-plugin';
const { ObjectId } = Schema.Types;

const SampleSchema: Schema = new Schema({
  bannerSetId: {
    type: ObjectId,
    required: true,
    unique: true
  },
  identifier: {
    index: true,
    type: String
  },
  description: {
    type: String
  }
});

SampleSchema.plugin(updatedOnPlugin);

const SampleModel: any = model('sample', SampleSchema);
export { SampleModel };