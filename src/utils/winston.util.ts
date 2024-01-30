import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const winstonLogger = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const logDir = configService.get<string>('LOG_DIR', 'minori-rag-application');
  const project = configService.get<string>('PROJECT_NAME', 'minori-rag-application');
  const env = configService.get<string>('NODE_ENV', 'development');

  const dailyOptions = (level: string) => {
    return {
      level,
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + `/${level}`,
      filename: `%DATE%.${level}.log`,
      maxFiles: 30,
      zippedArchive: true,
    };
  };

  return WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: env === 'production' ? 'http' : 'silly',
        format:
          env === 'production'
            ? winston.format.simple()
            : winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                utilities.format.nestLike(project, {
                  prettyPrint: true,
                }),
              ),
      }),

      new winstonDaily(dailyOptions('info')),
      new winstonDaily(dailyOptions('warn')),
      new winstonDaily(dailyOptions('error')),
    ],
  });
};
