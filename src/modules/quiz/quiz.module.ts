import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { AuthModule } from '@modules/auth/auth.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { FileModule } from '@modules/file/file.module';
import { QuizRepository } from './quiz.repository';
import { LangchainModule } from './langchain/langchain.module';
import { ReferModule } from '@modules/refer/refer.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    FileModule,
    LangchainModule,
    ReferModule,
  ],
  providers: [QuizService, QuizRepository],
  controllers: [QuizController],
})
export class QuizModule {}
