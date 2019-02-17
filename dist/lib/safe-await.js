"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function SafeAwait(promise) {
    return promise.then(data => {
        return [undefined, data];
    })
        .catch(err => [err]);
}
exports.default = SafeAwait;
//# sourceMappingURL=safe-await.js.map