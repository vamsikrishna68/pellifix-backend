import {get, response} from '@loopback/rest';
import * as data from '../data/data.json';
const stringfy = JSON.stringify(data);

export class ReferenceController {
  constructor() {}

  @get('/v1/reference/drop-down')
  @response(200, {
    description: 'Front end can use the drop down list for static values',
  })
  async dropDown(): Promise<Object> {
    return JSON.parse(stringfy);
  }
}
