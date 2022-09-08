import {MiddlewareSequence, RequestContext} from '@loopback/rest';
import {AuthUser} from './utils';
import path from 'path';
import fs from 'fs';
import AWS from 'aws-sdk';
export class MySequence extends MiddlewareSequence {
  async handle(context: RequestContext) {
    const {request, response} = context;
    // extract additional info from request header
    // and bind it to request-level context
    // const userId = request.headers.authorization;
    const id: any = request.headers.userid;
    const profile_id: any = request.headers.profileid;

    const authUser: AuthUser = {
      id,
      profile_id,
    };

    context.bind('authUser').to(authUser);
    await super.handle(context);
  }
}
