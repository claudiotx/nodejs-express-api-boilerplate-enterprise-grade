import { Request, Response, Router } from 'express';
import * as moment from 'moment';
import { RouteHandler, Get, Post, Put, Delete } from '../decorators/route-handler';
import DocsService from '../services/docs-service';
import Server from '../classes/server';
import SampleDoc from '../models/sample.doc';
import logService from '../services/log-service';
@RouteHandler('/api')

/*
  This route provides the basic CRUD operations under a REST pattern
*/

class ApiRoute {
  // Services Injection
  public router: Router;
  private docsService: DocsService;

  constructor(public app: Server) {
    this.docsService = new DocsService();
  }

  // REST Methods
  @Get('/')
  public getDocs(request: Request, response: Response): void {
    const from = moment.utc(request.query.from, 'DD-MM-YY').startOf('day');
    const to = moment.utc(request.query.to, 'DD-MM-YY').endOf('day');
    this.docsService.getDocs(from, to)
      .then((feeds: FeedDoc[]) => {
        return response.json(feeds);
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  @Get('/:id')
  public getFeedById(request: Request, response: Response): void {
    const id = request.params.id;
    this.docsService.getDocById(id)
      .then((feed: FeedDoc) => {
        return response.json(feed);
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  @Post()
  public createDoc(request: Request, response: Response): void {
    this.docsService.createDoc(request.body)
      .then((newDoc: any) => {
        return response.json(newDoc);
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  @Put()
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