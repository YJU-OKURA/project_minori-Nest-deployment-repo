export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  winston: WinstonConfig;
  security: SecurityConfig;
  aws: AwsConfig;
  langchain: LangchainConfig;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface WinstonConfig {
  logDir: string;
  project: string;
  env: string;
}

export interface SecurityConfig {
  secret: string;
  expiresIn: string;
}

export interface AwsConfig {
  region: string;
  s3: S3Config;
  cloudfront: string;
}

export interface S3Config {
  accessKey: string;
  secretAccessKey: string;
  bucket: string;
}

export interface LangchainConfig {
  openAIApiKey: string;
  localStoragePath: string;
  anthropicApiKey: string;
}
