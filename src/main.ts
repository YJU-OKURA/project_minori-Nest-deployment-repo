import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { winstonLogger } from './common/utils/winston.util';
import { swagger } from './common/utils/swagger.util';
import {
  ClassSerializerInterceptor,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { BigIntInterceptor } from '@common/interceptors/bigint.interceptor';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/nest/class/:c_id', {
    exclude: [
      'api/nest/quiz-banks/:id',
      {
        path: 'api/nest/quiz-banks',
        method: RequestMethod.GET,
      },
    ],
  });
  winstonLogger(app);
  swagger(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new BigIntInterceptor(),
    new ResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
