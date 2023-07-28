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

export const deleteFileFromS3 = async (fileName: string): Promise<void> => {
  try {
    const params = {
      Bucket: BucketName!,
      Key: 'profiles/' + fileName,
    };

    await S3.deleteObject(params).promise();
  } catch (error) {
    console.error(
      `Error deleting file '${fileName}' from S3 bucket '${BucketName}': ${error.message}`,
    );
    throw error;
  }
};
