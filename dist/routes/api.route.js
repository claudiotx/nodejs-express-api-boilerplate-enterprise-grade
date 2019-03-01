"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const route_handler_1 = require("../decorators/route-handler");
const docs_1 = __importDefault(require("../services/docs"));
const log_1 = __importDefault(require("../services/log"));
let ApiRoute = 
// This route provides the basic CRUD operations under a REST pattern
class ApiRoute {
    constructor(app) {
        this.app = app;
        this.docsService = new docs_1.default();
    }
    // REST CRUD Methods
    getDocs(request, response, next) {
        const { query } = request;
        log_1.default.log('info', 'getting docs...', { query });
        const from = moment_1.default.utc(query.from, 'DD-MM-YY').startOf('day');
        const to = moment_1.default.utc(query.to, 'DD-MM-YY').endOf('day');
        this.docsService.getDocs(from, to)
            .then((feeds) => {
            return response.json(feeds);
        })
            .catch((error) => {
            log_1.default.log(`error`, `Failed to get docs`, error);
            next(error);
        });
    }
    getDocById(request, response, next) {
        const { id } = request.params;
        log_1.default.log('info', 'getting doc by id...', { id });
        this.docsService.getDocById(id)
            .then((feed) => {
            return response.json(feed);
        })
            .catch((error) => {
            log_1.default.log('error', 'getting doc...', error);
            next(error);
        });
    }
    createDoc(request, response, next) {
        const { body } = request;
        log_1.default.log('info', 'creating doc...', { body });
        this.docsService.createDoc(body)
            .then((newDoc) => {
            return response.json(newDoc);
        })
            .catch((error) => {
            log_1.default.log('error', 'creating doc...', error);
            next(new Error('We couldnt create your doc at the moment. Please try again later.'));
        });
    }
    updateDoc(request, response, next) {
        const { body, params } = request;
        const { id } = params;
        this.docsService.updateDoc(id, body)
            .then((newDoc) => {
            return response.json(newDoc);
        })
            .catch((error) => {
            log_1.default.log('error', 'updating doc...', error);
            next(new Error('We couldnt update your doc at the moment. Please try again later.'));
        });
    }
    deleteDoc(request, response, next) {
        const { body, params } = request;
        const { id } = params;
        this.docsService.deleteDoc(id, body)
            .then((newDoc) => {
            return response.json(newDoc);
        })
            .catch((error) => {
            log_1.default.log('error', 'deleting doc...', error);
            next(new Error('We couldnt deleting your doc at the moment. Please try again later.'));
        });
    }
};
__decorate([
    route_handler_1.Get('/docs/')
], ApiRoute.prototype, "getDocs", null);
__decorate([
    route_handler_1.Get('/docs/:id')
], ApiRoute.prototype, "getDocById", null);
__decorate([
    route_handler_1.Post('/docs/')
], ApiRoute.prototype, "createDoc", null);
__decorate([
    route_handler_1.Put('/docs/:id')
], ApiRoute.prototype, "updateDoc", null);
__decorate([
    route_handler_1.Delete('/docs/:id')
], ApiRoute.prototype, "deleteDoc", null);
ApiRoute = __decorate([
    route_handler_1.RouteHandler('/api')
    // This route provides the basic CRUD operations under a REST pattern
], ApiRoute);
exports.default = ApiRoute;
//# sourceMappingURL=api.route.js.map