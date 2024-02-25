import { INestApplication } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { SwaggerConfig } from 'src/common/configs/config.interface';

export const swagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const swaggerConfig =
    configService.get<SwaggerConfig>('swagger');

  const config = new DocumentBuilder()
    .setTitle(
      swaggerConfig.title || 'Minori Rag Application',
    )
    .setDescription(
      swaggerConfig.description ||
        "The Minori Rag Application's API description",
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'JWT',
        in: 'header',
      },
      'Authorization',
    )
    .setVersion(swaggerConfig.version || '1.0')
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );
  SwaggerModule.setup(
    swaggerConfig.path || 'api',
    app,
    document,
  );
};
