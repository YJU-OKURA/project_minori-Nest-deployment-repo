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

  // TODO: jwt 관련 데이터 저장 방식 정하기
  // security: {
  //   expiresIn: '2m',
  //   refreshIn: '7d',
  //   bcryptSaltOrRound: 10,
  // },
};

export default (): Config => config;
