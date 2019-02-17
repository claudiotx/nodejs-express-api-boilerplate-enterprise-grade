"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const moment = require("moment");
const LogEntries = require("r7insight_node");
const winston = require("winston");
const uuid = require("uuid");
// https://www.npmjs.com/package/winston
const hostName = os.hostname();
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
        this.correlationId = uuid.v1();
        // Remote logs
        this.logEntries = new LogEntries({
            token: process.env.LOG_ENTRIES,
            minLevel: process.env.LOG_LEVEL || 'info',
            region: 'eu',
            levels: customLevels.levels,
            withStack: true
        });
        // The client is an EventEmitter
        this.logEntries.on('error', (err) => {
            console.log('something went wrong with remote logs via logentries', err);
        });
        // Local logs
        this.localLogEntries = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            levels: customLevels.levels,
            format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.prettyPrint()),
            transports: [
                new winston.transports.Console({
                    format: winston.format.simple()
                })
            ]
        });
        winston.addColors(customLevels.colors);
    }
    log(level = 'info', message = 'Log', obj = {}) {
        if (Object.keys(obj).length > 0) {
            this.localLogEntries.log({ level, message, obj });
            this.sendToLogEntries(level, message, obj);
        }
        else {
            this.localLogEntries.log({ level, message });
            this.sendToLogEntries(level, message);
        }
    }
    sendToLogEntries(level, message, obj) {
        let objStringified = '';
        if (obj) {
            objStringified = JSON.stringify(obj);
        }
        const printableMsg = `${moment().toDate()} ${hostName} ${message} ${objStringified}`;
        console.log(level);
        this.logEntries.log(level, printableMsg);
    }
}
exports.default = new LogService();
//# sourceMappingURL=log-service.js.map