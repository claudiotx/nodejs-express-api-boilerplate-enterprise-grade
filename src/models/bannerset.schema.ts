import { Schema, Model, model } from 'mongoose';
import DbService from '../services/dbs';
import BannerSetDoc from './bannerset.doc';

const getBannerSetModel = () => {
  return DbService.bannerwiseDb.model('bannerSet', BannerSetSchema);
};

const BannerSetSchema = new Schema({
  migrationId: {
    type: String
  },
  name: {
    type: String,
    default: 'My BannerSet',
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['banner', 'template']
  },
  formats: [{
    type: Schema.Types.ObjectId,
    ref: 'bannerFormat'
  }],
  banners: [{
    type: Schema.Types.ObjectId,
    ref: '_banner'
  }],
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'brand'
  },
  userIds: [{
    type: String,
    required: true,
    index: true
  }],
  accountIds: [{
    type: Schema.Types.ObjectId,
    index: true
  }],
  customerIds: [{
    type: Schema.Types.ObjectId,
    index: true
  }],
  preview: {
    type: Schema.Types.ObjectId,
    index: true
  },
  feed: {
    type: Schema.Types.ObjectId,
    ref: 'feed'
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'templateCategory'
  },
  network: {
    type: Schema.Types.ObjectId,
    ref: 'network'
  },
  thumbnail: String,
  feedUrl: String,
  clickUrl: String,
  folder: String,
  loop: Boolean,
  dynamic: Boolean,
  onTheFly: Boolean,
  cropAll: Boolean,
  retargetingPixel: String,
  yieldrId: String,
  retina: Boolean,
  disclaimerText: String,
  cloudinaryId: String,
  borderColor: String,
  backgroundColor: String,
  frozen: Boolean,
  experimentId: {
    type: Schema.Types.ObjectId,
    ref: 'experiment'
  }
});

// const BannerSetModel: Model<BannerSetDoc> = model<BannerSetDoc>('bannerSet', BannerSetSchema);
export { getBannerSetModel };