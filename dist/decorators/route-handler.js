"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
function RouteHandler(URL) {
    return function handleROUTE(target) {
        return class HandleRoute extends target {
            constructor(...args) {
                super(...args);
                const self = this;
                target.prototype.router = express_1.Router();
                target.prototype._routes.forEach((route) => {
                    target.prototype.router.route(route.url)[route.method](route.handler.bind(self));
                });
                args[0].addRoute(URL, target.prototype.router);
            }
        };
    };
}
exports.RouteHandler = RouteHandler;
function Get(param) {
    param = param || '/';
    return (target, propertyKey) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        const originalMethod = descriptor.value;
        target._routes = target._routes || [];
        target._routes.push({ url: param, method: 'get', handler: originalMethod });
        return descriptor;
    };
}
exports.Get = Get;
function Post(param) {
    param = param || '/';
    return (target, propertyKey) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        const originalMethod = descriptor.value;
        target._routes = target._routes || [];
        target._routes.push({ url: param, method: 'post', handler: originalMethod });
        return descriptor;
    };
}
exports.Post = Post;
function Put(param) {
    param = param || '/';
    return (target, propertyKey) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        const originalMethod = descriptor.value;
        target._routes = target._routes || [];
        target._routes.push({ url: param, method: 'post', handler: originalMethod });
        return descriptor;
    };
}
exports.Put = Put;
function Delete(param) {
    param = param || '/';
    return (target, propertyKey) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        const originalMethod = descriptor.value;
        target._routes = target._routes || [];
        target._routes.push({ url: param, method: 'post', handler: originalMethod });
        return descriptor;
    };
}
exports.Delete = Delete;
//# sourceMappingURL=route-handler.js.map