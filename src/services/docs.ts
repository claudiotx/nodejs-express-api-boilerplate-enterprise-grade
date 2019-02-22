import { Schema, Model, model } from 'mongoose';
import * as moment from 'moment';
import axios from 'axios';
import { Get, Post, Route, Put, Body, Delete, Tags, Controller } from 'tsoa';

import { Validate } from '../decorators/validate';
import SampleDoc from '../models/sample.doc';
import { SampleModel } from '../models/sample.model';
import SafeAwait from '../lib/safe-await';
import Doc from '../interfaces/doc';
import logService from '../controllers/log';

@Route('Docs')
@Tags('docs')
class DocsController extends Controller {
  @Get()
  public async getDocs(from: any, to: any): Promise<Feed[]> {
    return SampleModel.find()
      .then((docs: SampleDoc[]) => {
        return Promise.resolve(docs);
      })
      .catch((error: Error) => {
        logService.log('error', 'Error', error);
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
}

export default DocsController;