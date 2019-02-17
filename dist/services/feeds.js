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
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const tsoa_1 = require("tsoa");
const validate_1 = require("../decorators/validate");
const feed_schema_1 = require("../schemas/feed.schema");
const bannerset_schema_1 = require("../schemas/bannerset.schema");
const bwfeed_schema_1 = require("../schemas/bwfeed.schema");
const safe_await_1 = require("../lib/safe-await");
const feed_1 = require("../classes/feed");
const dynamic_feed_image_generator_1 = require("../schemas/dynamic-feed-image-generator");
let FeedsService = class FeedsService {
    // Support Method
    // XHR
    getFeeds(from, to) {
        const FeedModel = feed_schema_1.getFeedModel();
        return FeedModel.find()
            .then((feeds) => {
            return Promise.resolve(feeds);
        })
            .catch((error) => {
            console.error(error);
            return Promise.reject(error);
        });
    }
    getFeedById(id) {
        const FeedModel = feed_schema_1.getFeedModel();
        return FeedModel
            .findById(id)
            .then((feed) => {
            return Promise.resolve(feed);
        })
            .catch((error) => {
            console.error(error);
            return Promise.reject(error);
        });
    }
    createFeed(requestBody) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            // Get BannersetId, GetFeed
            const { bannerSetId } = requestBody;
            const BannerSetModel = bannerset_schema_1.getBannerSetModel();
            const BwFeedModel = bwfeed_schema_1.getBwFeedModel();
            const FeedModel = feed_schema_1.getFeedModel();
            const sample = new BwFeedModel(); // register schema typescript bug?
            // Check if exists
            const exists = yield FeedModel.findOne({ originalBannerSetId: bannerSetId });
            if (exists) {
                return reject(new Error(`A feed sync already exists with the provided BannersetId`));
            }
            // Create Snapshot
            const snapshotBannersetRequest = yield axios_1.default({
                method: 'post',
                url: `${process.env.SNAPSHOPT_URL}${bannerSetId}`,
            });
            const snapshotBannerset = snapshotBannersetRequest.data;
            // Use snapshot
            return BannerSetModel.findById(snapshotBannerset._id)
                .populate({
                path: 'feed',
                model: 'feed'
            })
                .then((bannerSet) => {
                if (!bannerSet.feed || !bannerSet.feed.metadata) {
                    throw new Error('This bannerset doesnt contain a feed');
                }
                const { url } = bannerSet.feed.metadata;
                if (!url) {
                    throw new Error('This feed does not contain a URL');
                }
                const feed = new feed_1.default(snapshotBannerset._id, bannerSetId, [], undefined, bannerSet.feed._id, url);
                const FeedModel = feed_schema_1.getFeedModel();
                const feedModel = new FeedModel(feed);
                feedModel
                    .save()
                    .then((createdFeed) => {
                    console.log('feed created', createdFeed);
                    console.log('updating...', createdFeed._id);
                    FeedModel.findByIdAndUpdate({ _id: String(createdFeed._id) }, { bannerwiseFeedUrl: `https://s3.eu-central-1.amazonaws.com/bannerwise-dynamic-feeds/${createdFeed._id}` }, { new: true })
                        .then((updatedFeed) => {
                        console.log('feed updated', updatedFeed);
                        return resolve(updatedFeed);
                    })
                        .catch((error) => {
                        console.log('oops failed to findByIdAndUpdate', error);
                        return reject(error);
                    });
                })
                    .catch((error) => {
                    return reject(error);
                });
            })
                .catch((error) => {
                console.log('oops failed findById', error);
                console.log(error);
                if (error.code === 11000) {
                    return reject(new Error(`A feed sync already exists with the provided BannersetId`));
                }
                return reject(error);
            });
        }));
    }
    // @Post()
    // @Validate([
    //   {
    //     param: 'bannerSetId',
    //     validate: 'required'
    //   }
    // ])
    markAllAsDirty(bannerSetId) {
        console.log('markAllAsDirty...');
        debugger;
        // Get BannersetId, GetFeed
        const BwFeedModel = bwfeed_schema_1.getBwFeedModel();
        const sample = new BwFeedModel(); // register schema typescript bug?
        const FeedModel = feed_schema_1.getFeedModel();
        return FeedModel.findOne({ originalBannerSetId: bannerSetId })
            .then((feedSyncModel) => {
            const syncFeedId = feedSyncModel._id;
            console.log('lets go', syncFeedId);
            const DynamicFeedImageModel = dynamic_feed_image_generator_1.default(syncFeedId);
            return DynamicFeedImageModel.updateMany({}, { dirty: true, bannerizedImageUrl: undefined, multi: true })
                .then((res) => {
                console.log('mark as dirty finished');
                return String(syncFeedId);
            })
                .catch((err) => {
                throw err;
            });
        })
            .catch((error) => {
            return Promise.reject(error);
        });
    }
    updateSnapshot(bannerSetId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('updateSnapshot');
            const FeedModel = feed_schema_1.getFeedModel();
            // Create Snapshot
            const snapshotBannersetRequest = yield axios_1.default({
                method: 'post',
                url: `${process.env.SNAPSHOPT_URL}${bannerSetId}`,
            });
            const snapshotBannerset = snapshotBannersetRequest.data;
            // Get FeedSync
            const feedSync = yield FeedModel.findOne({ originalBannerSetId: bannerSetId });
            // Update bannersetId
            const query = {
                historyBannerSetIds: feedSync.bannerSetId
            };
            const [error, updatedFeedSync] = yield safe_await_1.default(FeedModel.findOneAndUpdate({ originalBannerSetId: bannerSetId }, { bannerSetId: snapshotBannerset._id, $addToSet: query }, { new: true }));
            if (error) {
                throw new Error('Something went wrong whilst updating the feed');
            }
            console.log('feed was updated', updatedFeedSync.bannerSetId);
            const syncFeedId = feedSync._id;
            const DynamicFeedImageModel = dynamic_feed_image_generator_1.default(syncFeedId);
            return DynamicFeedImageModel.updateMany({}, { dirty: true, bannerSetId: updatedFeedSync.bannerSetId, bannerizedImageUrl: undefined }, { multi: true })
                .then((res) => {
                return String(syncFeedId);
            })
                .catch((err) => {
                throw err;
            });
        });
    }
};
__decorate([
    tsoa_1.Get()
], FeedsService.prototype, "getFeeds", null);
__decorate([
    tsoa_1.Get('{id}')
], FeedsService.prototype, "getFeedById", null);
__decorate([
    tsoa_1.Post(),
    validate_1.Validate([
        {
            param: 'bannerSetId',
            validate: 'required'
        }
    ]),
    __param(0, tsoa_1.Body())
], FeedsService.prototype, "createFeed", null);
FeedsService = __decorate([
    tsoa_1.Route('feeds'),
    tsoa_1.Tags('feeds')
], FeedsService);
exports.default = FeedsService;
//# sourceMappingURL=feeds.js.map