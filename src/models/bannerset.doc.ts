import { Document } from 'mongoose';

interface Bannerset extends Document {
  migrationId: string;
  name: string;
  type: string;
  formats: any;
  banners: any;
  brand: any;
  userIds: any;
  accountIds: any;
  customerIds: any;
  preview: any;
  feed: any;
  category: any;
  network: any;
  thumbnail: string;
  feedUrl: string;
  clickUrl: string;
  folder: string;
  loop: any;
  dynamic: any;
  onTheFly: any;
  cropAll: any;
  retargetingPixel: string;
  yieldrId: string;
  retina: any;
  disclaimerText: string;
  cloudinaryId: string;
  borderColor: string;
  backgroundColor: string;
  frozen: any;
  experimentId: string;
}
export default Bannerset;