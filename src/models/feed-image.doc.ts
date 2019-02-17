import { Document } from 'mongoose';

interface FeedImageDoc extends Document {
  originalId: string;
  feedSyncId: string;
  hash: string;
  originalImageUrl: string;
  maskUrl: string;
  bannerizedImageUrl?: string;
  price: string;
  dirty: boolean;
  updatedOn?: Date;
}
export default FeedImageDoc;