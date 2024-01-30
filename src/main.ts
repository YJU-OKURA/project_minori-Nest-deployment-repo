import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './utils/winston.util';
import { swagger } from './utils/swagger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(winstonLogger(app));

  swagger(app);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
