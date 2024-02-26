import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { winstonLogger } from './common/utils/winston.util';
import { swagger } from './common/utils/swagger.util';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { BigIntInterceptor } from '@common/interceptors/bigint.interceptor';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
