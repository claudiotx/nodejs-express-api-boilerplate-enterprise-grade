"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Feed {
    constructor(bannerSetId, originalBannerSetId, historyBannerSetIds, imagesCollectionId, feedId, feedUrl, bannerwiseFeedUrl, lastSyncOn, isSynching, changedOn) {
        this.bannerSetId = bannerSetId;
        this.originalBannerSetId = originalBannerSetId;
        this.historyBannerSetIds = historyBannerSetIds;
        this.imagesCollectionId = imagesCollectionId;
        this.feedId = feedId;
        this.feedUrl = feedUrl;
        this.bannerwiseFeedUrl = bannerwiseFeedUrl;
        this.lastSyncOn = lastSyncOn;
        this.isSynching = isSynching;
        this.changedOn = changedOn;
    }
}
exports.default = Feed;
//# sourceMappingURL=feed.js.map