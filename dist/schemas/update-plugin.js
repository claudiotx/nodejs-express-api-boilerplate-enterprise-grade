"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin = function updateOnPlugin(schema, options) {
    // Add new property to Schema
    schema.add({ updatedOn: Date });
    // Pre Hook
    schema.pre('save', function (next) {
        this.updatedOn = new Date;
        next();
    });
    if (options && options.index) {
        schema.path('updatedOn').index(options.index);
    }
};
exports.default = plugin;
//# sourceMappingURL=update-plugin.js.map