"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const log_1 = __importDefault(require("../services/log"));
class IndexRoute {
    constructor(applicationRoutes) {
        this.applicationRoutes = applicationRoutes;
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.route('').get((request, response) => {
            const meta = [];
            const fullUrl = request.protocol + '://' + request.get('host');
            this.applicationRoutes.forEach((resource) => {
                log_1.default.log(`debug`, `Setting route... ${resource}`);
                if (resource !== '/') {
                    meta.push({
                        rel: resource.replace(/\//g, ''),
                        href: fullUrl + resource
                    });
                }
            });
            response.json({ links: meta });
        });
    }
}
exports.default = IndexRoute;
//# sourceMappingURL=index.route.js.map