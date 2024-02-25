import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { AwsConfig } from '@common/configs/config.interface';
import { rmdir } from 'fs/promises';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly awsConfig: AwsConfig;

  constructor(private configService: ConfigService) {
    this.awsConfig =
      this.configService.get<AwsConfig>('aws');

    this.s3Client = new S3Client({
      region: this.awsConfig.region,
      credentials: {
        accessKeyId: this.awsConfig.s3.accessKey,
        secretAccessKey: this.awsConfig.s3.secretAccessKey,
      },
    });
  }

  /**
   * S3にファイルをアップロードし、アップロードしたファイルのCloudFront URLをリターン
   * @param file - アップロードするファイル
   * @param c_id - クラスID
   * @returns - アップロードしたファイルのCloudFront URL
   */
  async uploadToS3(
    file: Express.Multer.File,
    c_id: string,
  ): Promise<string> {
    const Key = `metarials/class${c_id}/${new Date().getTime()}.pdf`;
    const command = new PutObjectCommand({
      Bucket: this.awsConfig.s3.bucket,
      Key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentEncoding: file.encoding,
    });

    try {
      await this.s3Client.send(command);
    } catch {
      throw new InternalServerErrorException(
        'Failed to upload file to S3',
      );
    }

    return `${this.awsConfig.cloudfront}${Key}`;
  }

  /**
   * S3からファイルを削除
   * @param path - 削除するファイルのCloudFront URL
   * @returns - ファイルの削除が成功したかどうか
   */
  async deleteFileFromS3(path: string): Promise<boolean> {
    const key = path.replace(
      `${this.awsConfig.cloudfront}`,
      '',
    );
    const command = new DeleteObjectCommand({
      Bucket: this.awsConfig.s3.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch {
      throw new InternalServerErrorException(
        'Failed to delete file from S3',
      );
    }

    return true;
  }

  /**
   * ローカルからファイルを削除
   * @param path - 削除するファイルのパス
   * @returns - ファイルの削除が成功
   */
  async deleteFileFromLocal(
    path: string,
  ): Promise<boolean> {
    try {
      await rmdir(path, {
        recursive: true,
      });
      return true;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to delete file from local',
      );
    }
  }
}
