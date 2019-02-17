import { Document } from 'mongoose';

interface FeedDoc extends Document {
  bannerSetId: string;
  imagesCollectionId: string;
  feedId: any;
  feedUrl: string;
  bannerwiseFeedUrl?: string;
  lastSyncOn?: Date;
  isSynching?: boolean;
  changedOn?: Date;
}
export default FeedDoc;