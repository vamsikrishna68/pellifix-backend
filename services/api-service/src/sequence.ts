import {MiddlewareSequence, RequestContext} from '@loopback/rest';
import {AuthUser} from './utils';
export class MySequence extends MiddlewareSequence {
  async handle(context: RequestContext) {
    const {request} = context;
    // extract additional info from request header
    // and bind it to request-level context
    // const userId = request.headers.authorization;
    const id: any = request.headers.userid;
    const authUser: AuthUser = {
      id: +id,
    };

    context.bind('authUser').to(authUser);
    await super.handle(context);
  }
}
