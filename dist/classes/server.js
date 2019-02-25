"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const log_1 = __importDefault(require("../services/log"));
class Server {
    constructor(port = 4400) {
        this.routes = [];
        this.app = express_1.default();
        this.port = port;
        this.app.set('port', port);
        this.config();
        this.initialize();
    }
    config() {
        // Middleware to get form data
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(morgan_1.default('combined'));
        this.app.use((req, res, next) => {
            req.headers.origin = req.headers.origin || req.headers.host;
            next();
        });
        // CORS bypass
        const corsOptions = {
            origin: (origin, callback) => {
                const whitelist = [
                    'kube-probe/1.10'
                ];
                log_1.default.log('debug', `debug`, `Origin check ${origin}`);
                if (whitelist.indexOf(origin) === -1) {
                    callback(undefined, true);
                }
                else {
                    callback(undefined, true);
                    log_1.default.log('debug', `Not allowed by CORS ${origin}`);
                    log_1.default.log('debug', `Not allowed by CORS ${origin}`);
                    // callback(new Error(`Not allowed by CORS ${origin}`));
                }
            },
            allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
            methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        };
        this.app.use(cors_1.default(corsOptions));
        // Options HTTP Method (catch all)
        this.app.options('/*', (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            res.send(200);
        });
        this.httpServer = http_1.default.createServer(this.app);
    }
    safeTermination() {
        mongoose_1.default.disconnect().then(() => {
            log_1.default.log('debug', 'MongoDB safely shutting down interface...');
            process.exit(1);
        });
    }
    // Routing Methods
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
        process.once('SIGINT', () => {
            this.safeTermination();
        });
        const connectionOpts = {};
        this.db = mongoose_1.default.connection;
        this.db.once('open', () => {
            log_1.default.log('debug', 'Database connection is open.');
        });
        this.db.on('error', (err) => {
            log_1.default.log('debug', 'Database connection error.', err);
            if (err)
                throw err;
            process.exit(1);
        });
        // Atomic DB Connection
        mongoose_1.default.connect(process.env.MONGODB_URI, connectionOpts);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            log_1.default.log('debug', (`App is running at http://localhost:${this.app.get('port')} in ${this.app.get('env')} mode')`));
            log_1.default.log('debug', `Press CTRL-C to stop`);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map