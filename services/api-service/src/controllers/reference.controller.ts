import {get, response} from '@loopback/rest';
import * as data from '../data/data.json';
import * as states from '..//data/states.json';

export class ReferenceController {
  constructor() {}

  @get('/v1/reference/drop-down')
  @response(200, {
    description: 'Front end can use the drop down list for static values',
  })
  async dropDown(): Promise<Object> {
    return data;
  }

  @get('/v1/reference/states')
  @response(200, {
    description: 'Front end can use the drop down list for static values',
  })
  async states(): Promise<Object> {
    return states;
  }
}
