import { Schema, Model } from 'mongoose';
import { FeedImageSchema } from './feed-image.schema';
import DbService from '../services/dbs';
import BwFeedDoc from './bwfeed.doc';

function generate(feedSyncId: string) {
  const dynamicName = `feedsync-images-${feedSyncId}`;
  const dynamicModel = DbService.defaultDb.model(dynamicName, FeedImageSchema, dynamicName);
  return dynamicModel;
}

export default generate;