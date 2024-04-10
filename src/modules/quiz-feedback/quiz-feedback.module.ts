import { Module } from '@nestjs/common';
import { QuizFeedbackController } from './quiz-feedback.controller';
import { QuizFeedbackService } from './quiz-feedback.service';
import { QuizFeedbackRepository } from './quiz-feedback.repository';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { ClassUserModule } from '@modules/class-user/class-user.module';
import { OwnerGuard } from '@common/guards/owner.guard';
import { RolesGuard } from '@common/guards/role.guard';

@Module({
  imports: [PrismaModule, ClassUserModule],
  controllers: [QuizFeedbackController],
  providers: [
    QuizFeedbackService,
    QuizFeedbackRepository,
    OwnerGuard,
    RolesGuard,
  ],
})
export class QuizFeedbackModule {}
