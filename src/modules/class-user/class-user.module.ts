import { Module } from '@nestjs/common';
import { ClassUserRepository } from './class-user.repository';
import { PrismaModule } from '@modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ClassUserRepository],
  exports: [ClassUserRepository],
})
export class ClassUserModule {}
