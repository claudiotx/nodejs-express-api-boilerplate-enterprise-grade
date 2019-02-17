import { Document } from 'mongoose';

interface BwFeedDoc extends Document {
  name: string;
  accountIds: [string];
  networkId: string;
  customerId: string;
  feed: [any];
  metadata: any;
}
export default BwFeedDoc;