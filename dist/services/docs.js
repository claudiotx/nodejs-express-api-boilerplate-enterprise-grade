"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
const validate_1 = require("../decorators/validate");
const sample_model_1 = require("../models/sample.model");
const log_1 = __importDefault(require("../services/log"));
let DocsService = class DocsService {
    getDocs(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getting docs service');
            return sample_model_1.SampleModel.find();
        });
    }
    getDocById(id) {
        return sample_model_1.SampleModel
            .findById(id);
    }
    createDoc(requestBody) {
        log_1.default.log(`info`, `createDoc POST`, requestBody);
        return Promise.resolve(true);
    }
    updateDoc(requestBody) {
        log_1.default.log(`info`, `updateDoc POST`, requestBody);
        return Promise.resolve(true);
    }
};
__decorate([
    tsoa_1.Get()
], DocsService.prototype, "getDocs", null);
__decorate([
    tsoa_1.Get('{id}')
], DocsService.prototype, "getDocById", null);
__decorate([
    tsoa_1.Post(),
    validate_1.Validate([
        {
            param: 'docId',
            validate: 'required'
        }
    ]),
    __param(0, tsoa_1.Body())
], DocsService.prototype, "createDoc", null);
__decorate([
    tsoa_1.Put('{id}'),
    validate_1.Validate([
        {
            param: 'docId',
            validate: 'required'
        }
    ]),
    __param(0, tsoa_1.Body())
], DocsService.prototype, "updateDoc", null);
DocsService = __decorate([
    tsoa_1.Route('Docs'),
    tsoa_1.Tags('docs')
], DocsService);
exports.default = DocsService;
//# sourceMappingURL=docs.js.map