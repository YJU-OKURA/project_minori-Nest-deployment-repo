import { PrismaModule } from '@modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ReferRepository } from './refer.repository';

@Module({
  imports: [PrismaModule],
  providers: [ReferRepository],
  exports: [ReferRepository],
})
export class ReferModule {}
