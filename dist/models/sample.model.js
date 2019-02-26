"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const update_plugin_1 = __importDefault(require("./update-plugin"));
const { ObjectId } = mongoose_1.Schema.Types;
const SampleSchema = new mongoose_1.Schema({
    identifier: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    order: {
        type: Number
    }
});
SampleSchema.plugin(update_plugin_1.default);
const SampleModel = mongoose_1.model('sample', SampleSchema);
exports.SampleModel = SampleModel;
//# sourceMappingURL=sample.model.js.map