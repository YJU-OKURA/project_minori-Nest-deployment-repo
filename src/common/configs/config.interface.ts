export interface Config {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  winston: WinstonConfig;
  security: SecurityConfig;
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
