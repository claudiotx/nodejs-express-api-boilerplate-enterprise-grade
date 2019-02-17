"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dbs_1 = require("../services/dbs");
const getBannerSetModel = () => {
    return dbs_1.default.bannerwiseDb.model('bannerSet', BannerSetSchema);
};
exports.getBannerSetModel = getBannerSetModel;
const BannerSetSchema = new mongoose_1.Schema({
    migrationId: {
        type: String
    },
    name: {
        type: String,
        default: 'My BannerSet',
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['banner', 'template']
    },
    formats: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'bannerFormat'
        }],
    banners: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: '_banner'
        }],
    brand: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'brand'
    },
    userIds: [{
            type: String,
            required: true,
            index: true
        }],
    accountIds: [{
            type: mongoose_1.Schema.Types.ObjectId,
            index: true
        }],
    customerIds: [{
            type: mongoose_1.Schema.Types.ObjectId,
            index: true
        }],
    preview: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    feed: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'feed'
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'templateCategory'
    },
    network: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'network'
    },
    thumbnail: String,
    feedUrl: String,
    clickUrl: String,
    folder: String,
    loop: Boolean,
    dynamic: Boolean,
    onTheFly: Boolean,
    cropAll: Boolean,
    retargetingPixel: String,
    yieldrId: String,
    retina: Boolean,
    disclaimerText: String,
    cloudinaryId: String,
    borderColor: String,
    backgroundColor: String,
    frozen: Boolean,
    experimentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'experiment'
    }
});
//# sourceMappingURL=bannerset.schema.js.map