"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dbs_1 = __importDefault(require("../services/dbs"));
const getBwFeedModel = () => {
    return dbs_1.default.bannerwiseDb.model('feed', FeedSchema);
};
exports.getBwFeedModel = getBwFeedModel;
const FeedSchema = new mongoose_1.Schema({
    name: String,
    accountIds: [{
            type: mongoose_1.Schema.Types.ObjectId,
            index: true
        }],
    networkId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    feed: Array,
    metadata: Object
});
//# sourceMappingURL=bwfeed.schema.js.map