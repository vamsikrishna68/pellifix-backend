import {MiddlewareSequence, RequestContext} from '@loopback/rest';

export class MySequence extends MiddlewareSequence {
  async handle(context: RequestContext) {
    const {request, response} = context;
    // extract additional info from request header
    // and bind it to request-level context
    // const userId = request.headers.authorization;
    const pro_id = request.headers.userid;

    const authUser: object = {
      pro_id,
    };
    context.bind('authUser').to(authUser);
    await super.handle(context);
  }
}
