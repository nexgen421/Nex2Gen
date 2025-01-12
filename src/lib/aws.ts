import * as AWS from '@aws-sdk/client-s3';
import path from 'path';
import { env } from '~/env';

const client = new AWS.S3({
    region: env.NEXT_AWS_S3_REGION, 
    credentials: {
        accessKeyId: env.NEXT_AWS_S3_ACCESS_KEY_ID, 
        secretAccessKey: env.NEXT_AWS_S3_SECRET_ACCESS_KEY
    }
});

export const uploadFileToS3 = async (file: Buffer, fileName: string, fileType: string) => {
    try {
        const params: AWS.PutObjectCommandInput = {
            Bucket: env.NEXT_AWS_S3_BUCKET_NAME, 
            Key: fileName, 
            Body: file, 
            ContentType: fileType,
        };

        const command = new AWS.PutObjectCommand(params);

        const resp = await client.send(command);

        return resp;
    } catch (error) {
        throw error;
    }
}

export const uploadFileToS3Directory = async (file: Buffer, directoryName: string , fileName: string, fileType: string) => {
    try {
        const params: AWS.PutObjectCommandInput = {
            Bucket: env.NEXT_AWS_S3_BUCKET_NAME, 
            Key: path.join(directoryName, fileName), 
            Body: file, 
            ContentType: fileType,
        };

        const command = new AWS.PutObjectCommand(params);

        const resp = await client.send(command);
        return resp;
    } catch (error) {
        throw error;
    }
}
