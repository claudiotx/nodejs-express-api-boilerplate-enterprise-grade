"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const server_1 = require("./classes/server");
const index_route_1 = require("./routes/index.route");
const liveness_probe_route_1 = require("./routes/liveness-probe.route");
const feeds_route_1 = require("./routes/feeds.route");
const cron_1 = require("./services/cron");
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
const feedsRoute = new feeds_route_1.default(app);
const livenessProbeRoute = new liveness_probe_route_1.default(app);
const index = new index_route_1.default(app.getRoutes());
app.addRoute('/', index.router);
// Services
const cronService = new cron_1.default();
// EntryPoint
app.start();
//# sourceMappingURL=app.js.map