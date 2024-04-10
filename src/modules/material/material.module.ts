import { Module } from '@nestjs/common';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { UploadModule } from '@modules/material/upload/upload.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { MaterialRepository } from './material.repository';
import { LangchainModule } from '@modules/material/langchain/langchain.module';
import { ClassUserModule } from '@modules/class-user/class-user.module';

@Module({
  imports: [
    ClassUserModule,
    PrismaModule,
    UploadModule,
    LangchainModule,
  ],
  controllers: [MaterialController],
  providers: [MaterialService, MaterialRepository],
})
export class MaterialModule {}
