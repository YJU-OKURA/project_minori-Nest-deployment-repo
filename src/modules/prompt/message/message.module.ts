import { PrismaModule } from '@modules/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MessageRepository } from './message.repository';

@Module({
  imports: [PrismaModule],
  providers: [MessageRepository],
  exports: [MessageRepository],
})
export class MessageModule {}
