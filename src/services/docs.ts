import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
import axios from 'axios';
import { Get, Post, Route, Put, Body, Delete, Tags } from 'tsoa';

import { Validate } from '../decorators/validate';
import SampleDoc from '../models/sample.doc';
import { SampleModel } from '../models/sample.model';
import SafeAwait from '../lib/safe-await';
import Doc from '../interfaces/doc';
import logService from '../services/log';

@Route('Docs')
@Tags('docs')
class DocsService {
  @Get()
  public async getDocs(from?: moment.Moment, to?: moment.Moment): Promise<Doc[]> {
    return SampleModel.find();
  }

  @Get('{id}')
  public getDocById(id: string): Promise<Doc> {
    return SampleModel
      .findById(id);
  }

  @Post()
  @Validate([
    {
      param: 'identifier',
      validate: 'required'
    },
    {
      param: 'description',
      validate: 'required'
    }
  ])
  public createDoc(@Body() requestBody: any): Promise<any> {
    logService.log(`info`, `createDoc POST`, requestBody);
    const doc = new SampleModel(requestBody)
    return Promise.reject('oops');
  }

  @Put('{id}')
  @Validate([
    {
      param: 'docId',
      validate: 'required'
    }
  ])
  public updateDoc(@Body() requestBody: any): Promise<any> {
    logService.log(`info`, `updateDoc POST`, requestBody);
    return Promise.resolve(true);
  }
}

export default DocsService;