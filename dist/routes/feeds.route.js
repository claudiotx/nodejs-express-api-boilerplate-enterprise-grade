"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const route_handler_1 = require("../decorators/route-handler");
const feeds_1 = require("../services/feeds");
const crawler_1 = require("../services/crawler");
const log_service_1 = require("../classes/log-service");
const queue_1 = require("../services/queue");
let FeedsRoute = class FeedsRoute {
    constructor(app) {
        this.app = app;
        this.feedsService = new feeds_1.default();
    }
    // XHR Methods
    getAllFeeds(request, response) {
        const from = moment.utc(request.query.from, 'DD-MM-YY').startOf('day');
        const to = moment.utc(request.query.to, 'DD-MM-YY').endOf('day');
        this.feedsService.getFeeds(from, to)
            .then((feeds) => {
            return response.json(feeds);
        })
            .catch((error) => {
            return response.status(400).json({ error: error });
        });
    }
    getFeedById(request, response) {
        const id = request.params.id;
        this.feedsService.getFeedById(id)
            .then((feed) => {
            return response.json(feed);
        })
            .catch((error) => {
            console.error(error);
            return response.status(400).json({ error: error });
        });
    }
    // @Post('/mock')
    // public mocker(request: Request, response: Response): void {
    //   const createdFeed = {
    //     '_id' : '5c0560c14470430014324336',
    //     'bannerSetId' : '5bf40f3b690619001180b359',
    //     'feedId' : '5bf5674ea68619000faf9502',
    //     'feedUrl' : 'https://files.channable.com/9z4zTucJiVElIvP1efXuhQ==.csv',
    //     'bannerwiseFeedUrl' : 'https://s3.eu-central-1.amazonaws.com/bannerwise-dynamic-feeds/5c0560c14470430014324336',
    //     'lastSyncOn' : '2018-12-03T16:58:45.292+0000'
    //   };
    //   MailerService.sendFirstMail(createdFeed)
    //   .then(function (response) {
    //     console.log(`mail sent`);
    //   })
    //   .catch(function (error) {
    //     console.log(`mail error`, error);
    //   });
    // }
    mocker(request, response) {
        const payload = {
            bannerSetId: '5c1b89d99e6dbe000f341e16'
        };
        // this.feedsService.markAllAsDirty(payload)
        //   .then((feedSyncId: string) => {
        //     QueueService.generateBannerwiseImagesDirty(feedSyncId);
        //     return response.status(200);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     return response.status(500).json({ error: err });
        //   });
    }
    createFeed(request, response) {
        // QueueService.generateBannerwiseImagesFirstTime('5c0560c14470430014324336');
        this.feedsService.createFeed(request.body)
            // Promise.resolve({_id: 'xa1155', bannerwiseFeedUrl: 'www.google.pt', feedUrl: 'https://files.channable.com/9z4zTucJiVElIvP1efXuhQ==.csv'})
            .then((createdFeed) => {
            console.log('feed created...', createdFeed._id, createdFeed.feedUrl);
            // Detect feed type
            const crawlerService = new crawler_1.default();
            crawlerService.detectFeedType(createdFeed.feedUrl)
                .then(feedType => {
                console.log('feedType', feedType);
                if (feedType === 'csv') {
                    crawlerService.syncFeedCsv(createdFeed, createdFeed.feedUrl)
                        .then(res => {
                        queue_1.default.generateBannerwiseImagesFirstTime(createdFeed._id);
                        return response.json(res);
                    })
                        .catch((error) => {
                        return response.status(500).json({ error: error });
                    });
                }
                if (feedType === 'xml') {
                    crawlerService.syncFeedXml(createdFeed, createdFeed.feedUrl)
                        .then(res => {
                        queue_1.default.generateBannerwiseImagesFirstTime(createdFeed._id);
                        return response.json(res);
                    })
                        .catch((error) => {
                        return response.status(500).json({ error: error });
                    });
                }
            })
                .catch(error => {
                return response.status(500).json({ error: error });
            });
        })
            .catch((error) => {
            console.log('Could not create feed');
            if (error.message === 'This feed does not contain a URL') {
                return response.status(500).json({ error: error });
            }
            log_service_1.default.log('Something went wrong POST/feed', error.message);
            const customResponse = {
                status: 'refreshed'
            };
            console.log('marking as dirty');
            const { bannerSetId } = request.body;
            this.feedsService.updateSnapshot(bannerSetId)
                .then(res => {
                console.log('updateSnapshot OK', res);
                this.feedsService.markAllAsDirty(bannerSetId)
                    .then((feedSyncId) => {
                    queue_1.default.generateBannerwiseImagesDirty(feedSyncId);
                    return response.json(customResponse);
                })
                    .catch((err) => {
                    console.log(err);
                    return response.status(500).json({ error: err });
                });
            })
                .catch(err => {
                console.log(err);
                return response.status(500).json({ error: err });
            });
        });
    }
};
__decorate([
    route_handler_1.Get('/')
], FeedsRoute.prototype, "getAllFeeds", null);
__decorate([
    route_handler_1.Get('/:id')
], FeedsRoute.prototype, "getFeedById", null);
__decorate([
    route_handler_1.Post('/mock')
], FeedsRoute.prototype, "mocker", null);
__decorate([
    route_handler_1.Post()
], FeedsRoute.prototype, "createFeed", null);
FeedsRoute = __decorate([
    route_handler_1.RouteHandler('/feeds')
], FeedsRoute);
exports.default = FeedsRoute;
//# sourceMappingURL=feeds.route.js.map