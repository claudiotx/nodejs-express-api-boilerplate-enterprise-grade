import { Schema, Model, model } from 'mongoose';
import FeedDoc from './feed.doc';
import updatedOnPlugin from './update-plugin';
import { FeedImageSchema } from './feed-image.schema';
const { ObjectId } = Schema.Types;

import DbService from '../services/dbs';
import BwFeedDoc from './bwfeed.doc';

const getFeedModel = () => {
  return DbService.defaultDb.model('feedsync', FeedSchema);
};

const FeedSchema: Schema = new Schema({
  bannerSetId: {
    type: ObjectId,
    required: true,
    unique: true
  },
  originalBannerSetId: {
    type: ObjectId,
    required: true,
    unique: true
  },
  historyBannerSetIds: [{
    type: ObjectId,
    index: true
  }],
  imagesCollectionId: {
    type: ObjectId,
  },
  feedId: {
    type: String,
    required: true
  },
  feedUrl: {
    type: String,
    required: true
  },
  bannerwiseFeedUrl: String,
  lastSyncOn: Date,
  isSynching: Boolean,
  changedOn: Date
});

FeedSchema.plugin(updatedOnPlugin);



// const FeedModel: Model<FeedDoc> = model<FeedDoc>('feedsync', FeedSchema);
export { getFeedModel };