import { Request, Response, Router, NextFunction } from 'express';
import moment from 'moment';

import { RouteHandler, Get, Post, Put, Delete } from '../../decorators/route-handler';
import { Validate } from '../../decorators/validate';
import DocsService from '../../services/docs';
import Server from '../../classes/server';
import SampleDoc from '../../models/sample.doc';
import logService from '../../services/log';
@RouteHandler('/api')

// This route provides the basic CRUD operations under a REST pattern
class ApiRoute {
  // Services Injection
  public router: Router;
  private docsService: DocsService;

  constructor(public app: Server) {
    this.docsService = new DocsService();
  }

  // REST CRUD Methods
  @Get('/docs/')
  public getDocs(request: Request, response: Response, next: NextFunction): void {
    const { query } = request;
    logService.log('info', 'getting docs...', {query});
    const from = moment.utc(query.from, 'DD-MM-YY').startOf('day');
    const to = moment.utc(query.to, 'DD-MM-YY').endOf('day');
    this.docsService.getDocs(from, to)
      .then((feeds: SampleDoc[]) => {
        return response.json(feeds);
      })
      .catch((error: Error) => {
        logService.log(`error`, `Failed to get docs`, error);
        next(error);
      });
  }

  @Get('/docs/:id')
  public getDocById(request: Request, response: Response, next: NextFunction): void {
    const { id } = request.params;
    logService.log('info', 'getting doc by id...', {id});
    this.docsService.getDocById(id)
      .then((feed: SampleDoc) => {
        return response.json(feed);
      })
      .catch((error: Error) => {
        logService.log('error', 'getting doc...', error);
        next(error);
      });
  }

  @Post('/docs/')
  public createDoc(request: Request, response: Response, next: NextFunction): void {
    const { body } = request;
    logService.log('info', 'creating doc...', {body});
    this.docsService.createDoc(body)
      .then((newDoc: SampleDoc) => {
        return response.json(newDoc);
      })
      .catch((error: Error) => {
        logService.log('error', 'creating doc...', error);
        next(new Error('We couldnt create your doc at the moment. Please try again later.'));
      });
  }

  @Put('/docs/:id')
  public updateDoc(request: Request, response: Response, next: NextFunction): void {
    const { body, params } = request;
    const { id } = params;
    this.docsService.updateDoc(id, body)
      .then((newDoc: any) => {
        if (!newDoc) {
          next(new Error('We couldnt find your doc to update at the moment. Please try again later.'));
          return;
        }
        return response.json(newDoc);
      })
      .catch((error: Error) => {
        logService.log('error', 'updating doc...', error);
        next(new Error('We couldnt update your doc at the moment. Please try again later.'));
      });
  }

  @Delete('/docs/:id')
  public deleteDoc(request: Request, response: Response, next: NextFunction): void {
    const { body, params } = request;
    const { id } = params;
    this.docsService.deleteDoc(id, body)
      .then((newDoc: any) => {
        if (!newDoc) {
          next(new Error('We couldnt find your doc to delete at the moment. Please try again later.'));
          return;
        }
        return response.json(newDoc);
      })
      .catch((error: Error) => {
        logService.log('error', 'deleting doc...', error);
        next(new Error('We couldnt delete your doc at the moment. Please try again later.'));
      });
  }
}

export default ApiRoute;