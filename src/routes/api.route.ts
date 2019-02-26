import { Request, Response, Router } from 'express';
import moment from 'moment';

import { RouteHandler, Get, Post, Put, Delete } from '../decorators/route-handler';
import { Validate } from '../decorators/validate';
import DocsService from '../services/docs';
import Server from '../classes/server';
import SampleDoc from '../models/sample.doc';
import logService from '../services/log';
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
  public getDocs(request: Request, response: Response): void {
    logService.log('info', 'getting docs...');
    const from = moment.utc(request.query.from, 'DD-MM-YY').startOf('day');
    const to = moment.utc(request.query.to, 'DD-MM-YY').endOf('day');
    this.docsService.getDocs(from, to)
      .then((feeds: SampleDoc[]) => {
        return response.json(feeds);
      })
      .catch((error: Error) => {
        logService.log(`error`, `Failed to get docs`, error);
        throw error;
      });
  }

  @Get('/docs/:id')
  public getFeedById(request: Request, response: Response): void {
    const id = request.params.id;
    this.docsService.getDocById(id)
      .then((feed: SampleDoc) => {
        return response.json(feed);
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  @Post('/docs/')
  public createDoc(request: Request, response: Response, next: any): void {
    this.docsService.createDoc(request.body)
      .then((newDoc: SampleDoc) => {
        return response.json(newDoc);
      })
      // Error handling on the upper level
  }

  @Put('/docs/:id')
  public updateDoc(request: Request, response: Response): void {
    this.docsService.updateDoc(request.body)
      .then((newDoc: any) => {
        return response.json(newDoc);
      })
      .catch((error: Error) => {
        throw error;
      });
  }
}

export default ApiRoute;