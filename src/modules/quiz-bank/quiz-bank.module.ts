import { Module } from '@nestjs/common';
import { QuizBankService } from './quiz-bank.service';
import { QuizBankController } from './quiz-bank.controller';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ClassUserModule } from '@modules/class-user/class-user.module';
import { QuizBankRepository } from './quiz-bank.repository';

@Module({
  imports: [PrismaModule, ClassUserModule],
  providers: [QuizBankService, QuizBankRepository],
  controllers: [QuizBankController],
})
export class QuizBankModule {}
