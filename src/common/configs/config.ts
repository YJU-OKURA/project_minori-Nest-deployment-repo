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
    path: 'api',
  },
  winston: {
    logDir: 'logs',
    project: 'minori-rag-application',
    env: 'development',
  },

  security: {
    secret: process.env.JWT_ACCESS_SECRET || 'secret',
    expiresIn: process.env.JWT_ACCESS_EXPIRATION || '30m',
  },
};

export default (): Config => config;
