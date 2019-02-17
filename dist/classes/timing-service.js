"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const log = console.log;
const logError = console.error;
const hostName = os.hostname();
class TimingService {
    start() {
        return process.hrtime();
    }
    stop(start) {
        const hrEnd = process.hrtime(start);
        const pretty = `Execution time (hr): ${hrEnd[0]} ${(hrEnd[1] / 1000000).toFixed(2)}`;
        return pretty;
    }
}
exports.default = new TimingService();
//# sourceMappingURL=timing-service.js.map