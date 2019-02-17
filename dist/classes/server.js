"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const log_service_1 = require("./log-service");
const dbs_1 = require("../services/dbs");
const mailer_1 = require("../services/mailer");
class Server {
    constructor(port = 4400) {
        /* restrict properties are scoped to this class only */
        this.routes = [];
        this.app = express();
        this.port = port;
        this.app.set('port', port);
        this.config();
        this.initialize();
    }
    config() {
        // Middleware to get form data
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(logger('combined'));
        this.app.use((req, res, next) => {
            req.headers.origin = req.headers.origin || req.headers.host;
            next();
        });
        const corsOptions = {
            origin: (origin, callback) => {
                const whitelist = [
                    'kube-probe/1.10'
                ];
                log_service_1.default.log(`Origin check ${origin}`);
                if (whitelist.indexOf(origin) === -1) {
                    callback(undefined, true);
                }
                else {
                    callback(undefined, true);
                    log_service_1.default.error(`Not allowed by CORS ${origin}`);
                    log_service_1.default.log(`Not allowed by CORS ${origin}`);
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
    safeTermination() {
        mongoose.disconnect().then(() => {
            log_service_1.default.log('MongoDB safely shutting down interface...');
            process.exit(1);
        });
    }
    addRoute(routeUrl, routerHandler) {
        if (this.routes.indexOf(routeUrl) === -1) {
            this.routes.push(routeUrl);
            this.app.use(routeUrl, routerHandler);
        }
    }
    getRoutes() {
        return this.routes;
    }
    initialize() {
        log_service_1.default.init();
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
        dbs_1.default.bannerwiseDb = this.dbBannerwise;
        dbs_1.default.defaultDb = this.db;
        this.dbBannerwise.once('open', () => {
            log_service_1.default.log('Database connection is open for Bannerwise Core.');
        });
        this.db.once('open', () => {
            log_service_1.default.log('Database connection is open for Feed Sync Service DB.');
        });
        this.db.on('error', (err) => {
            log_service_1.default.error('MongoDB Feed Sync Service DB connection error.', err);
            if (err) {
                throw err;
            }
            process.exit();
        });
        this.dbBannerwise.on('error', (err) => {
            log_service_1.default.error('Bannerwise Core DB connection error.', err);
            if (err) {
                throw err;
            }
            process.exit();
        });
        mailer_1.default.init();
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            log_service_1.default.log((`App is running at http://localhost:${this.app.get('port')} in ${this.app.get('env')} mode')`));
            log_service_1.default.log(`Press CTRL-C to stop
        `);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map