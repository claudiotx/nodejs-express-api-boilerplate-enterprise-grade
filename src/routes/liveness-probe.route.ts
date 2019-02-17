import { Request, Response, Router } from 'express';
import { RouteHandler, Get, Post, Put, Delete } from '../decorators/route-handler';
import logService from '../classes/log-service';
import Server from '../classes/server';
import * as moment from 'moment';
import * as os from 'os';

@RouteHandler('/health')
class LivenessProbeRoute {
  public router: Router;

  constructor(public app: Server) {}

  @Get('*')
  public broadcastStats(request: Request, response: Response): Response {
    logService.log('broacasting');
    const stats = this.getBasicStats();
    return response.json(stats);
  }

  private humanizeBytes(amount: number) {
    if (amount) {
      const amountInMb = (amount / (1024 * 1024)).toFixed(2);
      return `${amountInMb} MB`;
    } else {
      return;
    }
  }

  private getBasicStats() {
    const data = {
      os: {
        uptime: moment.duration(os.uptime(), 'seconds').humanize()
      },
      cpu: {
        cores: os.cpus().length,
        loadavg: os.loadavg()
      },
      memory: {
        total: this.humanizeBytes(os.totalmem()),
        free: this.humanizeBytes(os.freemem())
      },
      heap: {
        total: this.humanizeBytes(process.memoryUsage().heapTotal),
        used: this.humanizeBytes(process.memoryUsage().heapUsed),
        rss: this.humanizeBytes(process.memoryUsage().rss)
      },
      process: {
        uptime: moment.duration(process.uptime(), 'seconds').humanize()
      }
    };
    return data;
  }
}

export default LivenessProbeRoute;