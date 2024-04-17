import { applyDecorators, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { OwnerGuard } from '@common/guards/owner.guard';
import { Key, MetaData } from './metadata.decorator';

export const UseOwnerGuards = (model: Prisma.ModelName) => {
  return applyDecorators(
    MetaData<Prisma.ModelName>(Key.MODELS, model),
    UseGuards(OwnerGuard),
    ApiForbiddenResponse({
      description:
        'リソースにアクセスする権限がありません。',
    }),
  );
};
