"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const server_1 = __importDefault(require("./classes/server"));
const index_route_1 = __importDefault(require("./routes/index.route"));
const liveness_probe_route_1 = __importDefault(require("./routes/liveness-probe.route"));
const api_route_1 = __importDefault(require("./routes/api.route"));
if (!process.env.NODE_ENV) {
    dotenv.config({ path: './env/.env.development' });
}
else if (process.env.NODE_ENV === 'staging') {
    dotenv.config({ path: './env/.env.staging' });
}
else if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: './env/.env.production' });
}
else {
    dotenv.config({ path: './env/.env.development' });
}
// App Initialization
const app = new server_1.default(process.env.PORT || 8080);
// Routes
const apiRoute = new api_route_1.default(app);
const livenessProbeRoute = new liveness_probe_route_1.default(app);
const index = new index_route_1.default(app.getRoutes());
app.addRoute('/', index.router);
app.addErrorHandler();
// EntryPoint
app.start();
//# sourceMappingURL=app.js.map