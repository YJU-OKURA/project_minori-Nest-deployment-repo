import { Module } from '@nestjs/common';
import { PromptController } from './prompt.controller';
import { PromptService } from './prompt.service';
import { PromptRepository } from './prompt.repository';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { LangchainModule } from './langchain/langchain.module';
import { MessageModule } from './message/message.module';
import { ReferModule } from '../refer/refer.module';
import { ClassUserModule } from '@modules/class-user/class-user.module';

@Module({
  imports: [
    ClassUserModule,
    PrismaModule,
    LangchainModule,
    MessageModule,
    ReferModule,
  ],
  controllers: [PromptController],
  providers: [PromptService, PromptRepository],
})
export class PromptModule {}
