"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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