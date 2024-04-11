import { Module } from '@nestjs/common';
import { MaterialFeedbackController } from './material-feedback.controller';
import { MaterialFeedbackService } from './material-feedback.service';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { MaterialFeedbackRepository } from './material-feedback.repository';
import { ReferModule } from '@modules/refer/refer.module';
import { LangchainModule } from './langchain/langchain.module';
import { FileModule } from '../file/file.module';
import { ClassUserModule } from '@modules/class-user/class-user.module';

@Module({
  imports: [
    PrismaModule,
    ClassUserModule,
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
