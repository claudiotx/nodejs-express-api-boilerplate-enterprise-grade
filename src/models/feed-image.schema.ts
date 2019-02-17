import { Schema, Model, model } from 'mongoose';
import FeedImageDoc from './feed-image.doc';
import updatedOnPlugin from './update-plugin';
const { ObjectId } = Schema.Types;

const FeedImageSchema: Schema = new Schema({
  originalId: {
    type: String,
    required: true,
    unique: true
  },
  feedSyncId: {
    type: ObjectId,
    required: true,
  },
  hash: {
    type: String,
    required: true,
    unique: true
  },
  bannerSetId: {
    type: ObjectId,
    required: true,
  },
  originalImageUrl: {
    type: String,
    required: true,
  },
  maskUrl: {
    type: String,
    required: true,
  },
  bannerizedImageUrl: {
    type: String,
  },
  price: {
    type: String,
  },
  dirty: {
    type: Boolean,
    required: true,
  },
  updatedOn: {
    type: Date,
    required: true,
  }
});

FeedImageSchema.plugin(updatedOnPlugin);

// const FeedImageModel: Model<FeedImageDoc> = model<FeedImageDoc>('feedImage', FeedImageSchema);
export { FeedImageSchema };