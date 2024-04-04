import { applyDecorators, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { OwnerGuard } from '@common/guards/owner.guard';
import { Key, MetaData } from './metadata.decorator';

export const UseOwnerGuards = (
  model: Prisma.ModelName,
  id: string = 'id',
) => {
  return applyDecorators(
    MetaData<Prisma.ModelName>(Key.MODELS, model),
    MetaData<string>(Key.ID_PARAM, id),
    UseGuards(OwnerGuard),
    ApiForbiddenResponse({
      description: 'このアクセスする権限がありません。',
    }),
  );
};
