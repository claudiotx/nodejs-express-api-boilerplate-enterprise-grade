"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const update_plugin_1 = require("./update-plugin");
const { ObjectId } = mongoose_1.Schema.Types;
const dbs_1 = require("../services/dbs");
const getFeedModel = () => {
    return dbs_1.default.defaultDb.model('feedsync', FeedSchema);
};
exports.getFeedModel = getFeedModel;
const FeedSchema = new mongoose_1.Schema({
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
FeedSchema.plugin(update_plugin_1.default);
//# sourceMappingURL=feed.schema.js.map