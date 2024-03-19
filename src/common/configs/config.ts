import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    title: 'minori-rag-application',
    description:
      "The Minori Rag Application's API description",
    version: '1.5',
    path: 'api/nest',
  },
  winston: {
    logDir: process.env.LOCAL_STORAGE_PATH
      ? `${process.env.LOCAL_STORAGE_PATH}/logs`
      : '/c/logs',
    project: 'minori-rag-application',
    env: 'development',
  },
  security: {
    secret: process.env.JWT_ACCESS_SECRET || 'secret',
    expiresIn: process.env.JWT_ACCESS_EXPIRATION || '30m',
  },
  aws: {
    region: process.env.AWS_REGION || 'region',
    s3: {
      accessKey:
        process.env.AWS_S3_ACCESS_KEY || 'accessKey',
      secretAccessKey:
        process.env.AWS_S3_SECRET_ACCESS_KEY ||
        'secretAccessKey',
      bucket: process.env.AWS_S3_BUCKET || 'bucket',
    },
    cloudfront: process.env.AWS_CLOUDFRONT || 'cloudfront',
  },
  langchain: {
    openAIApiKey:
      process.env.OPENAI_API_KEY_FOR_NEST || 'openAIApiKey',
    localStoragePath: process.env.LOCAL_STORAGE_PATH
      ? `${process.env.LOCAL_STORAGE_PATH}/vector-store`
      : '/c/vector-store',
    anthropicApiKey:
      process.env.ANTHROPIC_API_KEY || 'anthropicApiKey',
  },
};

export default (): Config => config;
