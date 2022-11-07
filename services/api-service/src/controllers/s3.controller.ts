import * as AWS from 'aws-sdk';
import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  Request,
  Response,
  RestBindings,
  HttpErrors,
} from '@loopback/rest';

import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import {repository} from '@loopback/repository';
import {ImagesRepository, ProfilesRepository} from '../repositories';
import {AuthUser} from '../utils';
import {s3Upload} from './S3-upload';
import {FileFields} from '../types';

export class StorageController {
  constructor(
    @repository(ImagesRepository)
    public imagesRepository: ImagesRepository,
    @repository(ProfilesRepository)
    public profileRepository: ProfilesRepository,
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
        'multipart/form-data value. The path section give a which type of image you upload.',
      required: true,
      content: {
        'multipart/form-data': {
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    // max file size to upload in bytes
    const fileSize = 1024 * 1024 * 5; // 2MB
    // accepet image extensions format
    const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const profile = await this.profileRepository.findById(this.authUser.id);

    return new Promise<object>((resolve, reject) => {
      const storage = multer.memoryStorage();
      const upload = multer({
        storage,
        limits: {
          fileSize,
        },
      }).array('images', 5);

      upload(request, response, async (err: any) => {
        const imagesList: FileFields[] = [];
        const files: any = request.files;
        // Handling Errors
        if (!files?.length) reject(this.throwError('NO_FILE'));
        if (err) reject(this.throwError(err.code));

        let file: FileFields;
        for (file of files) {
          if (whitelist.includes(file.mimetype)) {
            file.newfilename = this.fileName(profile.profile_id!);
            imagesList.push(file);
          } else {
            reject(this.throwError('NOT_IMAGE'));
          }
        }

        /**
         * Image upload in S3
         */
        const data = await s3Upload(imagesList);
        const result = await this.insertIntoRds(data, imagesList);

        response.json({
          error: false,
          message: 'File upload successfuly',
          data: result,
        });
      });
    });
  }

  throwError(code: string): {statusCode: number; message: string} {
    switch (code) {
      case 'LIMIT_FILE_SIZE':
        return {
          statusCode: 422,
          message: 'File size only allowed 5MB',
        };
      case 'LIMIT_UNEXPECTED_FILE':
        return {
          statusCode: 422,
          message: 'Maximum 5 images only allowed ',
        };
      case 'NO_FILE':
        return {
          statusCode: 422,
          message: 'Required images',
        };
      case 'NOT_IMAGE':
        return {
          statusCode: 422,
          message:
            'Only allowed image/png image/jpeg image/jpg image/webp types. ',
        };

      default:
        return {
          statusCode: 422,
          message: 'Error in image upload',
        };
    }
  }

  fileName(profileId: string): string {
    return profileId.toLocaleLowerCase() + '_' + uuidv4() + '.jpg';
  }

  /**
   *
   * @param s3Data
   * @param files
   * @returns
   */
  async insertIntoRds(
    s3Data: AWS.S3.ManagedUpload.SendData[],
    files: FileFields[],
  ): Promise<string[]> {
    const imageUrls: string[] = [];
    let result = s3Data.map(x => {
      const file = files.find(v => 'profiles/' + v.newfilename === x.Key);

      const url = 'https://img.pellifix.com/' + x.Key;

      imageUrls.push(url);
      return {
        pro_id: this.authUser.id,
        orginal_name: file?.originalname || '',
        new_name: file?.newfilename || '',
        url,
        primary_pic: false,
        size: String(file?.size) || '',
      };
    });

    result[0].primary_pic = true;

    await this.imagesRepository.createAll(result);
    return imageUrls;
  }
}
