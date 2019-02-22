import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';

import logService from '../services/log';

class Server {
  protected app: express.Application;
  protected httpServer: http.Server;
  private db: mongoose.Connection;
  private routes: string[] = [];
  public port: number | string;

  constructor(port: number | string = 4400) {
    this.app = express();
    this.port = port;
    this.app.set('port', port);
    this.config();
    this.initialize();
  }

  private config() {
    // Middleware to get form data
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(logger('combined'));
    this.app.use((req, res, next) => {
      req.headers.origin = req.headers.origin || req.headers.host; next();
    });

    // CORS bypass
    const corsOptions = {
      origin: (origin: string, callback: any) => {
        const whitelist = [
          'kube-probe/1.10'
        ];
        logService.log(`Origin check ${origin}`);
        if (whitelist.indexOf(origin) === -1) {
          callback(undefined, true);
        } else {
          callback(undefined, true);
          logService.log(`Not allowed by CORS ${origin}`);
          logService.log(`Not allowed by CORS ${origin}`);
          // callback(new Error(`Not allowed by CORS ${origin}`));
        }
      },
      allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    this.app.use(cors(corsOptions));

    // Options HTTP Method (catch all)
    this.app.options('/*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.send(200);
    });
    this.httpServer = http.createServer(this.app);
  }

  private safeTermination() {
    mongoose.disconnect().then(() => {
      logService.log('MongoDB safely shutting down interface...');
      process.exit(1);
    });
  }

  // Routing Methods
  public addRoute(routeUrl: string, routerHandler: express.Router): void {
    if (this.routes.indexOf(routeUrl) === -1) {
      this.routes.push(routeUrl);
      this.app.use(routeUrl, routerHandler);
    }
  }

  public getRoutes(): string[] {
    return this.routes;
  }

  public initialize(): void {
    process.once('SIGINT', () => {
      this.safeTermination();
    });

    const connectionOpts = {};
    this.db = mongoose.createConnection(process.env.MONGODB_URI, connectionOpts);

    this.db.once('open', () => {
      logService.log('Database connection is open.');
    });

    this.db.on('error', (err) => {
      logService.log('Database connection error.', err);
      if (err) throw err;
      process.exit(1);
    });
  }

  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      logService.log((`App is running at http://localhost:${this.app.get('port')} in ${this.app.get('env')} mode')`));
      logService.log(`Press CTRL-C to stop`);
    });
  }
}

export default Server;