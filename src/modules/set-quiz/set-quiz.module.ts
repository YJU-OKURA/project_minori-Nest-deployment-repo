import { Module } from '@nestjs/common';
import { SetQuizController } from './set-quiz.controller';
import { SetQuizService } from './set-quiz.service';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { SetQuizRepository } from './set-quiz.repository';
import { OwnerGuard } from '@common/guards/owner.guard';
import { RolesGuard } from '@common/guards/role.guard';
import { ClassUserModule } from '@modules/class-user/class-user.module';

@Module({
  imports: [PrismaModule, ClassUserModule],
  controllers: [SetQuizController],
  providers: [
    SetQuizService,
    SetQuizRepository,
    OwnerGuard,
    RolesGuard,
  ],
})
export class SetQuizModule {}
