import { Module } from '@nestjs/common';
import { MaterialFeedbackController } from './material-feedback.controller';
import { MaterialFeedbackService } from './material-feedback.service';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { MaterialFeedbackRepository } from './material-feedback.repository';
import { ReferModule } from '@modules/refer/refer.module';
import { LangchainModule } from './langchain/langchain.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ReferModule,
    LangchainModule,
    FileModule,
  ],
  controllers: [MaterialFeedbackController],
  providers: [
    MaterialFeedbackService,
    MaterialFeedbackRepository,
  ],
})
export class MaterialFeedbackModule {}
