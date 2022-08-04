import * as AWS from 'aws-sdk';
import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  Request,
  Response,
  RestBindings,
  HttpErrors,
  get,
  param,
} from '@loopback/rest';

import multer from 'multer';
import * as stream from 'stream';
import uniqid from 'uniqid';
import {repository} from '@loopback/repository';
import {ImagesRepository} from '../repositories';
import {AuthUser} from '../utils';
const {Duplex} = stream;

function bufferToStream(buffer: any) {
  const duplexStream = new Duplex();
  duplexStream.push(buffer);
  duplexStream.push(null);
  return duplexStream;
}

const config = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
const s3 = new AWS.S3(config);

export class StorageController {
  constructor(
    @repository(ImagesRepository)
    public imagesRepository: ImagesRepository,
    @inject('authUser')
    public authUser: AuthUser,
  ) {
    if (!this.authUser.id) {
      throw new HttpErrors.Unauthorized('Unauthorized');
    }
  }

  @post('/v1/profiles/images/uploads', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: '',
      },
    },
  })
  async upload(
    @requestBody({
      description:
        'multipart/form-data value. The path section give a which type of image you upload. Example produt,category,store,user,driver,vehicle',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    // max file size to upload in bytes
    const fileSize = 1024 * 1024 * 5; // 5MB

    // accepet image extensions format
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

    return new Promise<object>((resolve, reject) => {
      const storage = multer.memoryStorage();
      const upload = multer({
        storage,
        //restrict limit size of image
        limits: {
          fileSize,
        },
      }).single('avatar');

      upload(request, response, async (err: any) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            reject({
              message: `Maximum file size 5MB`,
              code: 'Limit file size',
              statusCode: 400,
            });
          } else {
            reject(err);
          }
        } else {
          if (!request.file) {
            reject({
              message: 'Image is required',
              code: 'Bad Request',
              statusCode: 400,
            });
          }

          if (!request.file) {
            throw new HttpErrors.UnprocessableEntity('Image is required');
          }

          const file = request.file.originalname;
          const primary_pic =
            request.body && request.body.primary == 'true' ? true : false;

          // Check the media type file
          let myFile = file.split('.');
          const fileType = '.' + myFile[myFile.length - 1];
          const typeCheck = allowedExtensions.includes(fileType);
          if (!typeCheck) {
            let error = {
              message: 'JPEG, PNG, JPG images only allow',
              code: 'Unsupported Media Type.',
              statusCode: 415,
            };
            // throw error
            reject(error);
          }

          // Create image file name
          const uploadName =
            uniqid(`${this.authUser.profile_id}`, `${this.authUser.id}`) +
            fileType;

          /**
           * Upload the image on AWS-S3 bucket
           */

          try {
            const params = {
              Bucket: process.env.AWS_BUCKET_NAME || '',
              Key: uploadName, // File name you want to save as in S3
              Body: bufferToStream(request.file.buffer),
            };
            const stored = await s3.upload(params).promise();

            await this.imagesRepository.create({
              pro_id: this.authUser.id,
              orginal_name: file,
              hash: uploadName,
              size: request.file.size.toString(),
              url: stored.ETag,
              primary_pic,
              unique_id: 1,
            });

            resolve({image: stored});
            resolve({success: 'success'});
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }
}
