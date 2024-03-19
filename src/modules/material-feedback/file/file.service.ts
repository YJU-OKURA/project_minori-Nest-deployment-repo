import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { AwsConfig } from '@common/configs/config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
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
   * S3からファイルを取得
   * @param path - ファイルのパス
   * @returns - 取得したファイルのBlob
   */
  async getFileFromS3(path: string) {
    const Key = path.replace(
      `${this.awsConfig.cloudfront}`,
      '',
    );

    const command = new GetObjectCommand({
      Bucket: this.awsConfig.s3.bucket,
      Key,
    });
    try {
      const { Body } = await this.s3Client.send(command);

      const bodyContents = await Body.transformToString(
        'binary',
      );
      const bodyBuffer = Buffer.from(
        bodyContents,
        'binary',
      );

      return new Blob([bodyBuffer]);
    } catch {
      throw new InternalServerErrorException(
        'Failed to load file from S3',
      );
    }
  }
}
