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

    /**
     * download image from s3
     */
    const URL = request.originalUrl.indexOf('/v1/pellifix/images');
    if (URL === 0) {
      //s3 image download start
      const reqUrl = request.originalUrl.split('/');
      const key = reqUrl[reqUrl.length - 1];
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME || '',
        Key: key,
      };
      const basepath = path.join(__dirname, '../uploads');
      if (!fs.existsSync(basepath)) {
        fs.mkdirSync(basepath, {recursive: true});
      }
      if (!fs.existsSync(`${basepath}/${key}`)) {
        const s3 = new AWS.S3({
          region: process.env.AWS_REGION,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
        const data: any = await s3.getObject(params).promise();
        fs.writeFile(`${basepath}/${key}`, data.Body, () => {});
      }
      //s3 image download end
    }

    context.bind('authUser').to(authUser);
    await super.handle(context);
  }
}
