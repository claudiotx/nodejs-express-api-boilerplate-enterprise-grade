import os from 'os';
import moment from 'moment';
// import * as LogEntries from 'r7insight_node';
import winston from 'winston';
import uuid from 'uuid';

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
  private logEntries: any;
  private localLogs: any;
  private correlationId: string = uuid.v1();

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

    // Local logs
    this.localLogs = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      levels: customLevels.levels,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.prettyPrint()
        ),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    });
    winston.addColors(customLevels.colors);
  }

  public log(level = 'info', message = 'Log', obj = {}): void {
    if (Object.keys(obj).length > 0) {
      this.localLogs.log({level, message, obj});
      // this.sendToLogEntries(level, message, obj);
    } else {
      this.localLogs.log({level, message});
      // this.sendToLogEntries(level, message);
    }
  }

  public sendToLogEntries(level: string, message: string, obj?: any) {
    let objStringified = '';
    if (obj) {
      objStringified = JSON.stringify(obj);
    }
    const printableMsg = `${moment().toDate()} ${hostName} ${message} ${objStringified}`;
    console.log(level);
    // this.logEntries.log(level, printableMsg);
  }
}
export default new LogService();