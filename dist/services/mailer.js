"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { ObjectId } = mongoose_1.Types;
const safe_await_1 = require("../lib/safe-await");
const bannerset_schema_1 = require("../schemas/bannerset.schema");
const account_schema_1 = require("../schemas/account.schema");
const feed_schema_1 = require("../schemas/feed.schema");
const log_service_1 = require("../classes/log-service");
class MailerService {
    constructor() {
        this.originEmail = 'developers@bannerwise.io';
        this.recipientEmail = 'developers@bannerwise.io';
        this.recipientName = 'Facebook Feed Sync Service';
        this.stages = {
            creation: {
                subject: `Your new feed has been created and is now available.`
            },
            update: {
                subject: `Your feed has been updated.`
            },
            error: {
                subject: `We're sorry but a small error occured while your feed was being created. We've been notified but please feel free to contact us at support@bannerwise.io.`
            }
        };
        // logService.log('Mailer Service Running');
    }
    sendMail(stage, destinationEmails, feedUrl) {
        const mergeVarsProvisioned = destinationEmails.reduce((prev, next, index) => {
            const bluePrint = {
                rcpt: next.email,
                vars: [
                    {
                        name: 'feedurl',
                        content: feedUrl
                    }
                ]
            };
            prev.push(bluePrint);
            return prev;
        }, []);
        const uri = this.mandrillTemplate;
        const payload = {
            key: this.mandrillKey,
            template_name: 'facebook-feed',
            template_content: [{
                    name: 'feedurl',
                    content: feedUrl
                }],
            message: {
                subject: stage.subject,
                to: destinationEmails,
                merge_vars: mergeVarsProvisioned
            }
        };
        console.log(JSON.stringify(payload));
        return true;
        // return axios.post(uri, payload);
    }
    prepareClosingDoc(syncFeedId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('prepareClosingDoc', syncFeedId);
            const createdFeed = yield feed_schema_1.getFeedModel().findById(syncFeedId);
            const [error, allMails] = yield safe_await_1.default(this.getAllEmails(createdFeed.bannerSetId));
            if (error)
                return error;
            return {
                allMails,
                bannerwiseFeedUrl: createdFeed.bannerwiseFeedUrl
            };
        });
    }
    getAllEmails(bannerSetId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const registerAccountSchema = account_schema_1.getAccountModel(); // register schema
            const BannerSetModel = bannerset_schema_1.getBannerSetModel();
            const [error, bannerSet] = yield safe_await_1.default(BannerSetModel.aggregate([
                { $match: { _id: ObjectId(bannerSetId) } },
                { $lookup: { from: 'accounts', localField: 'customerIds', foreignField: 'customers', as: 'account' } }
            ]));
            if (error)
                return reject(error);
            const accounts = bannerSet[0].account;
            const account = accounts[0];
            // const emails = [...[account.email], ...account.aliases];
            // const defaultBwEmails = [
            //   {
            //     email: 'joost@bannerwise.io',
            //     name: 'Mr Joost',
            //     type: 'to'
            //   },
            //   {
            //     email: 'developers@bannerwise.io',
            //     name: 'Bannerwise Dev Team',
            //     type: 'to'
            //   },
            // ];
            const defaultBwEmails = [];
            const emails = ['claudio@bannerwise.io', 'devops@bannerwise.io'];
            const formattedEmails = emails.reduce((prev, next, index) => {
                const bluePrint = {
                    email: next,
                    name: next,
                    type: 'to'
                };
                prev.push(bluePrint);
                return prev;
            }, defaultBwEmails);
            resolve(formattedEmails);
        }));
    }
    init() {
        this.mandrillKey = process.env.MANDRILL_KEY;
        this.mandrillTemplate = process.env.MANDRILL_TEMPLATE;
        log_service_1.default.log('initialized mail service');
    }
}
// singleton
exports.default = new MailerService();
//# sourceMappingURL=mailer.js.map