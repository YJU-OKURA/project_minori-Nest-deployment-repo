import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from '@middlewares/logger.middleware';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { PrismaModule } from '@modules/prisma/prisma.module';
import config from '@common/configs/config';
import { MaterialModule } from '@modules/material/material.module';
import { PromptModule } from '@modules/prompt/prompt.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@common/guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { SecurityConfig } from '@common/configs/config.interface';
import { MaterialFeedbackModule } from '@modules/material-feedback/material-feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig =
          configService.get<SecurityConfig>('security');
        return {
          secret: securityConfig.secret,
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    MaterialModule,
    PromptModule,
    MaterialFeedbackModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
