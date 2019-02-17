"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const route_handler_1 = require("../decorators/route-handler");
const log_service_1 = require("../classes/log-service");
const moment = require("moment");
const os = require("os");
let LivenessProbeRoute = class LivenessProbeRoute {
    constructor(app) {
        this.app = app;
    }
    broadcastStats(request, response) {
        log_service_1.default.log('broacasting');
        const stats = this.getBasicStats();
        return response.json(stats);
    }
    humanizeBytes(amount) {
        if (amount) {
            const amountInMb = (amount / (1024 * 1024)).toFixed(2);
            return `${amountInMb} MB`;
        }
        else {
            return;
        }
    }
    getBasicStats() {
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
};
__decorate([
    route_handler_1.Get('*')
], LivenessProbeRoute.prototype, "broadcastStats", null);
LivenessProbeRoute = __decorate([
    route_handler_1.RouteHandler('/health')
], LivenessProbeRoute);
exports.default = LivenessProbeRoute;
//# sourceMappingURL=liveness-probe.route.js.map