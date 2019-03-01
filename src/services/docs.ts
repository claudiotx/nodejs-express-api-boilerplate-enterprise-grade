import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
import axios from 'axios';
import { Get, Post, Route, Put, Body, Delete, Tags, Path } from 'tsoa';

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
  public getDocById(id: string): Promise<SampleDoc> {
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
  public createDoc(@Body() requestBody: any): Promise<SampleDoc> {
    logService.log(`info`, `createDoc POST`, requestBody);
    const doc = new SampleModel(requestBody)
    return doc.save();
  }

  @Put('{id}')
  @Validate([
    {
      param: 'id',
      validate: 'required',
      atomic: true
    }
  ])
  public updateDoc(@Path() id: string, @Body() requestBody: any): Promise<SampleDoc> {
    logService.log(`info`, `updateDoc POST`, {id, requestBody});
    const options = {
      new: true,
      safe: true, // default to value set in schema
      upsert: true, // create a new doc if condition not found
      multi: false, // update multiple docs at the same time
      strict: false
    };
    return SampleModel.findByIdAndUpdate(id, requestBody, options);
  }

  @Delete('{id}')
  @Validate([
    {
      param: 'id',
      validate: 'required',
      atomic: true
    }
  ])
  public deleteDoc(@Path() id: string, @Body() requestBody: any): Promise<SampleDoc> {
    logService.log(`info`, `deleteDoc DELETE`, {id, requestBody});
    return SampleModel.findByIdAndDelete(id);
  }
}

export default DocsService;