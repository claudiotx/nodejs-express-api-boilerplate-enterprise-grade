import { Document } from 'mongoose';

interface SampleDoc extends Document {
  identifier: string;
  description: string;
  changedOn?: Date;
}
export default SampleDoc;