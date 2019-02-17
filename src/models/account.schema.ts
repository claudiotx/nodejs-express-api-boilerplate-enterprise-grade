import { Schema, Model, model } from 'mongoose';
import DbService from '../services/dbs';

const getAccountModel = () => {
  return DbService.bannerwiseDb.model('account', AccountSchema);
};

// Mongoose Schemas
const CompanySchema = new Schema({
  name: String,
  type: String,
  email: String,
  vatId: String,
  address: Object,
  position: String
});

const BillingInfoSchema = new Schema({
  firstname: String,
  lastname: String,
  title: String,
  company: String,
  email: String,
  address: String,
  city: String,
  zipcode: String,
  country: String,
  vatNumber: String,
  kvkNumber: String,
  exactId: String,
  exactCode: Number
});

const AccountSchema = new Schema({
  migrationId: {
    type: String
  },
  name: String,
  company: CompanySchema,
  position: String,
  phone: String,
  email: {
    type: String,
    required: true,
    unique: true,
    set: (e: any) => e.toLowerCase()
  },
  userId: {
    type: String,
    index: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    index: true
  },
  userIds: [
    {
      type: Schema.Types.ObjectId,
      index: true
    }
  ],
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'organization'
  },
  whitelabel: {
    type: Schema.Types.ObjectId,
    ref: 'whitelabel'
  },
  active: {
    type: Boolean,
    default: false
  },
  activationKey: {
    type: String,
    select: false
  },
  billingInfo: BillingInfoSchema,
  subscription: {
    type: Schema.Types.ObjectId,
    ref: 'subscription'
  },
  subscriptions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'subscription'
    }
  ],
  preferredPayment: {
    type: Schema.Types.ObjectId,
    ref: 'payment'
  },
  availablePayments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'payment'
    }
  ],
  previewSettings: {
    logo: String,
    color: String,
    baseUrl: String,
    retargetingPixel: String
  },
  connectedNetworks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'networkConnection'
    }
  ],
  // @TODO: Deprecate this
  brands: [
    {
      type: Schema.Types.ObjectId,
      ref: 'brands'
    }
  ],
  customers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'customer'
    }
  ],
  testData: {
    type: Boolean,
    default: false
  },
  aliases: [
    {
      type: String,
      unique: true
    }
  ],
  deleted: {
    type: Boolean,
    default: false
  },
  mccActivated: {
    type: Boolean,
    default: false
  },
  medium: String
});

export { getAccountModel };