import * as AWS from 'aws-sdk';
import {FileFields} from '../types';

const config = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const BucketName = process.env.AWS_BUCKET_NAME;
const S3 = new AWS.S3(config);

export const s3Upload = async (files: FileFields[]) => {
  const params = files.map(file => {
    return {
      Bucket: BucketName!,
      Key: 'profiles/' + file.newfilename,
      Body: file.buffer,
    };
  });

  return await Promise.all(params.map(param => S3.upload(param).promise()));
};
