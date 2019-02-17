"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
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
            this.applicationRoutes.forEach((resourse) => {
                // logService.log(`Setting route... ${resourse}`);
                if (resourse !== '/') {
                    meta.push({
                        rel: resourse.replace(/\//g, ''),
                        href: fullUrl + resourse
                    });
                }
            });
            response.json({ links: meta });
        });
    }
}
exports.default = IndexRoute;
//# sourceMappingURL=index.route.js.map