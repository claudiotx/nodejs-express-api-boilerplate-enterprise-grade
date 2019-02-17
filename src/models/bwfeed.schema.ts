import { Schema, Model } from 'mongoose';
import DbService from '../services/dbs';
import BwFeedDoc from './bwfeed.doc';

const getBwFeedModel = () => {
  return DbService.bannerwiseDb.model('feed', FeedSchema);
};

const FeedSchema: Schema = new Schema({
  name: String,
  accountIds: [{
      type: Schema.Types.ObjectId,
      index: true
  }],
  networkId: {
      type: Schema.Types.ObjectId,
      index: true
  },
  customerId: {
      type: Schema.Types.ObjectId,
      index: true
  },
  feed: Array,
  metadata: Object
});

// const BwFeedModel: Model<BwFeedDoc> = model('feed', FeedSchema);
export { getBwFeedModel };