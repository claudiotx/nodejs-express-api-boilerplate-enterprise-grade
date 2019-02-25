"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = __importDefault(require("os"));
const moment_1 = __importDefault(require("moment"));
// import * as LogEntries from 'r7insight_node';
const winston_1 = __importDefault(require("winston"));
const uuid_1 = __importDefault(require("uuid"));
// https://www.npmjs.com/package/winston
const hostName = os_1.default.hostname();
const customLevels = {
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
    },
    colors: {
        emerg: 'red',
        alert: 'red',
        crit: 'red',
        error: 'red',
        warning: 'yellow',
        notice: 'green',
        info: 'blue',
        debug: 'white'
    }
};
class LogService {
    constructor() {
        // Remote logs
        // this.logEntries = new LogEntries({
        //   token: process.env.LOG_ENTRIES,
        //   minLevel: process.env.LOG_LEVEL || 'info',
        //   region: 'eu',
        //   levels: customLevels.levels,
        //   withStack: true
        // });
        // The client is an EventEmitter
        // this.logEntries.on('error', (err: any) => {
        //   console.log('something went wrong with remote logs via logentries', err);
        // });
        this.correlationId = uuid_1.default.v1();
        // Local logs
        this.localLogs = winston_1.default.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            levels: customLevels.levels,
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.colorize(), winston_1.default.format.prettyPrint()),
            transports: [
                new winston_1.default.transports.Console({
                    format: winston_1.default.format.simple()
                })
            ]
        });
        winston_1.default.addColors(customLevels.colors);
    }
    log(level = 'info', message = 'Log', obj = {}) {
        if (Object.keys(obj).length > 0) {
            this.localLogs.log({ level, message, obj });
            // this.sendToLogEntries(level, message, obj);
        }
        else {
            this.localLogs.log({ level, message });
            // this.sendToLogEntries(level, message);
        }
    }
    sendToLogEntries(level, message, obj) {
        let objStringified = '';
        if (obj) {
            objStringified = JSON.stringify(obj);
        }
        const printableMsg = `${moment_1.default().toDate()} ${hostName} ${message} ${objStringified}`;
        console.log(level);
        // this.logEntries.log(level, printableMsg);
    }
}
exports.default = new LogService();
//# sourceMappingURL=log.js.map