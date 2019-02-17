import { Schema, Model, model } from 'mongoose';
import * as moment from 'moment';
import axios from 'axios';
import { Get, Post, Route, Put, Body, Delete, Tags } from 'tsoa';


import { Validate } from '../decorators/validate';
import { getFeedModel } from '../schemas/feed.schema';
import { getBannerSetModel } from '../schemas/bannerset.schema';
import { getBwFeedModel } from '../schemas/bwfeed.schema';
import FeedDoc from '../schemas/feed.doc';
import SafeAwait from '../lib/safe-await';
import Feed from '../interfaces/feed';
import FeedConstructor from '../classes/feed';
import FeedImagesCollectionGenerator from '../schemas/dynamic-feed-image-generator';

@Route('feeds')
@Tags('feeds')
class FeedsService {
  // Support Method

  // XHR
  @Get()
  public getDocsFromMongo(from: any, to: any): Promise<Feed[]> {
    const FeedModel = getFeedModel();
    return FeedModel.find()
      .then((feeds: FeedDoc[]) => {
        return Promise.resolve(feeds);
      })
      .catch((error: Error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  @Get('{id}')
  public getFeedById(id: string): Promise<Feed> {
    const FeedModel = getFeedModel();
    return FeedModel
      .findById(id)
      .then((feed: FeedDoc) => {
        return Promise.resolve(feed);
      })
      .catch((error: Error) => {
        console.error(error);
        return Promise.reject(error);
      });
  }

  @Post()
  @Validate([
    {
      param: 'bannerSetId',
      validate: 'required'
    }
  ])
  public createFeed(@Body() requestBody: Feed): Promise<Feed> {
    return new Promise(async (resolve: any, reject: any) => {
      // Get BannersetId, GetFeed
      const { bannerSetId } = requestBody;
      const BannerSetModel = getBannerSetModel();
      const BwFeedModel = getBwFeedModel();
      const FeedModel = getFeedModel();
      const sample = new BwFeedModel(); // register schema typescript bug?

      // Check if exists
      const exists = await FeedModel.findOne({originalBannerSetId: bannerSetId});
      if (exists) {
        return reject(new Error(`A feed sync already exists with the provided BannersetId`));
      }

      // Create Snapshot
      const snapshotBannersetRequest: any = await axios({
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
        .then((bannerSet: any) => {
          if (!bannerSet.feed || !bannerSet.feed.metadata) {
            throw new Error('This bannerset doesnt contain a feed');
          }
          const { url } = bannerSet.feed.metadata;
          if (!url) {
            throw new Error('This feed does not contain a URL');
          }

          const feed = new FeedConstructor(snapshotBannerset._id, bannerSetId, [], undefined, bannerSet.feed._id,  url);
          const FeedModel = getFeedModel();
          const feedModel = new FeedModel(feed);
          feedModel
            .save()
            .then((createdFeed: FeedDoc) => {
              console.log('feed created', createdFeed);
              console.log('updating...', createdFeed._id);
              FeedModel.findByIdAndUpdate({_id: String(createdFeed._id)}, { bannerwiseFeedUrl: `https://s3.eu-central-1.amazonaws.com/bannerwise-dynamic-feeds/${createdFeed._id}`}, {new: true})
                .then((updatedFeed: any) => {
                  console.log('feed updated', updatedFeed);
                  return resolve(updatedFeed);
                })
                .catch((error: any) => {
                  console.log('oops failed to findByIdAndUpdate', error);
                  return reject(error);
                });

            })
            .catch((error: any) => {
              return reject(error);
            });
        })
        .catch((error: any) => {
          console.log('oops failed findById', error);
          console.log(error);
          if (error.code === 11000) {
            return reject(new Error(`A feed sync already exists with the provided BannersetId`));
          }
          return reject(error);
        });
    });
  }

  // @Post()
  // @Validate([
  //   {
  //     param: 'bannerSetId',
  //     validate: 'required'
  //   }
  // ])
  public markAllAsDirty(bannerSetId: string): Promise<string> {
    console.log('markAllAsDirty...');
    debugger;
    // Get BannersetId, GetFeed
    const BwFeedModel = getBwFeedModel();
    const sample = new BwFeedModel(); // register schema typescript bug?
    const FeedModel = getFeedModel();
    return FeedModel.findOne({originalBannerSetId: bannerSetId})
      .then((feedSyncModel: any) => {
        const syncFeedId = feedSyncModel._id;
        console.log('lets go', syncFeedId);
        const DynamicFeedImageModel = FeedImagesCollectionGenerator(syncFeedId);
        return DynamicFeedImageModel.updateMany({}, { dirty: true, bannerizedImageUrl: undefined, multi: true } )
          .then((res: any) => {
            console.log('mark as dirty finished');
            return String(syncFeedId);
          })
          .catch((err: any) => {
            throw err;
          });
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  }

  public async updateSnapshot(bannerSetId: string): Promise<string> {
    console.log('updateSnapshot');
    const FeedModel = getFeedModel();

    // Create Snapshot
    const snapshotBannersetRequest: any = await axios({
      method: 'post',
      url: `${process.env.SNAPSHOPT_URL}${bannerSetId}`,
    });
    const snapshotBannerset = snapshotBannersetRequest.data;

    // Get FeedSync
    const feedSync = await FeedModel.findOne({ originalBannerSetId: bannerSetId });

    // Update bannersetId
    const query = {
      historyBannerSetIds: feedSync.bannerSetId
    };
    const [error, updatedFeedSync] = await SafeAwait(FeedModel.findOneAndUpdate({ originalBannerSetId: bannerSetId }, { bannerSetId: snapshotBannerset._id, $addToSet: query  }, {new: true}));
    if (error) {
      throw new Error('Something went wrong whilst updating the feed');
    }
    console.log('feed was updated', updatedFeedSync.bannerSetId);

    const syncFeedId = feedSync._id;
    const DynamicFeedImageModel = FeedImagesCollectionGenerator(syncFeedId);
    return DynamicFeedImageModel.updateMany({}, { dirty: true, bannerSetId: updatedFeedSync.bannerSetId, bannerizedImageUrl: undefined }, { multi: true } )
      .then((res: any) => {
        return String(syncFeedId);
      })
      .catch((err: any) => {
        throw err;
      });


  }
}

export default FeedsService;