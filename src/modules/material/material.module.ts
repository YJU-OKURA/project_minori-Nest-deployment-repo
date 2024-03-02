import { Module } from '@nestjs/common';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { AuthModule } from '@modules/auth/auth.module';
import { UploadModule } from '@modules/material/upload/upload.module';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { MaterialRepository } from './material.repository';
import { LangchainModule } from '@modules/material/langchain/langchain.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UploadModule,
    LangchainModule,
  ],
  controllers: [MaterialController],
  providers: [MaterialService, MaterialRepository],
})
export class MaterialModule {}
