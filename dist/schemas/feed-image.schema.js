"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const update_plugin_1 = require("./update-plugin");
const { ObjectId } = mongoose_1.Schema.Types;
const FeedImageSchema = new mongoose_1.Schema({
    originalId: {
        type: String,
        required: true,
        unique: true
    },
    feedSyncId: {
        type: ObjectId,
        required: true,
    },
    hash: {
        type: String,
        required: true,
        unique: true
    },
    bannerSetId: {
        type: ObjectId,
        required: true,
    },
    originalImageUrl: {
        type: String,
        required: true,
    },
    maskUrl: {
        type: String,
        required: true,
    },
    bannerizedImageUrl: {
        type: String,
    },
    price: {
        type: String,
    },
    dirty: {
        type: Boolean,
        required: true,
    },
    updatedOn: {
        type: Date,
        required: true,
    }
});
exports.FeedImageSchema = FeedImageSchema;
FeedImageSchema.plugin(update_plugin_1.default);
//# sourceMappingURL=feed-image.schema.js.map