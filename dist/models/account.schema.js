"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dbs_1 = __importDefault(require("../services/dbs"));
const getAccountModel = () => {
    return dbs_1.default.bannerwiseDb.model('account', AccountSchema);
};
exports.getAccountModel = getAccountModel;
// Mongoose Schemas
const CompanySchema = new mongoose_1.Schema({
    name: String,
    type: String,
    email: String,
    vatId: String,
    address: Object,
    position: String
});
const BillingInfoSchema = new mongoose_1.Schema({
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
const AccountSchema = new mongoose_1.Schema({
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
        set: (e) => e.toLowerCase()
    },
    userId: {
        type: String,
        index: true
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    userIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            index: true
        }
    ],
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'organization'
    },
    whitelabel: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'subscription'
    },
    subscriptions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'subscription'
        }
    ],
    preferredPayment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'payment'
    },
    availablePayments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'networkConnection'
        }
    ],
    // @TODO: Deprecate this
    brands: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'brands'
        }
    ],
    customers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
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
//# sourceMappingURL=account.schema.js.map