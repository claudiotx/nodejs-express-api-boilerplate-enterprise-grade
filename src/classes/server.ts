import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as cors from 'cors';
import mongoose = require('mongoose');

import logService from '../services/log-service';
import MailerService from '../services/mailer';

class Server {

  /* protected properties will be accessible from deriving classes.  */
  protected app: express.Application;
  protected server: http.Server;
  private db: mongoose.Connection;

  /* restrict properties are scoped to this class only */
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
          logService.error(`Not allowed by CORS ${origin}`);
          logService.log(`Not allowed by CORS ${origin}`);
          // callback(new Error(`Not allowed by CORS ${origin}`));
        }
      },
      allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
      methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    // CORS
    this.app.use(cors(corsOptions));

    // Options
    this.app.options('/*', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.send(200);
    });
    this.server = http.createServer(this.app);
  }

  private safeTermination() {
    mongoose.disconnect().then(() => {
      logService.log('MongoDB safely shutting down interface...');
      process.exit(1);
    });
  }

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
    logService.init();
    process.once('SIGINT', () => {
      this.safeTermination();
    });

    const connectionOpts = {};
    console.log(process.env.BW_MONGODB_URI);
    const defaultConnection = mongoose.createConnection(process.env.MONGODB_URI);
    const bannerwiseConnection = mongoose.createConnection(process.env.BW_MONGODB_URI, connectionOpts);

    this.db = defaultConnection;
    this.dbBannerwise = bannerwiseConnection;

    // Share db instances
    DbService.bannerwiseDb = this.dbBannerwise;
    DbService.defaultDb = this.db;

    this.dbBannerwise.once('open', () => {
      logService.log('Database connection is open for Bannerwise Core.');
    });

    this.db.once('open', () => {
      logService.log('Database connection is open for Feed Sync Service DB.');
    });

    this.db.on('error', (err) => {
      logService.error('MongoDB Feed Sync Service DB connection error.', err);
      if (err) {
        throw err;
      }
      process.exit();
    });
    this.dbBannerwise.on('error', (err) => {
      logService.error('Bannerwise Core DB connection error.', err);
      if (err) {
        throw err;
      }
      process.exit();
    });
    MailerService.init();
  }



  public start(): void {
    this.app.listen(this.app.get('port'), () => {
      logService.log((`App is running at http://localhost:${this.app.get('port')} in ${this.app.get('env')} mode')`));
      logService.log(`Press CTRL-C to stop
        `);
    });
  }
}

export default Server;