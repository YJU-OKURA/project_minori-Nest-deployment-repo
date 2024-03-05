import { applyDecorators, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { Models } from './model.decorator';
import { OwnerGuard } from '@common/guards/owner.guard';

export const UseOwnerGuards = (model: Prisma.ModelName) => {
  return applyDecorators(
    Models(model),
    UseGuards(OwnerGuard),
    ApiForbiddenResponse({
      description: 'このアクセスする権限がありません。',
    }),
  );
};
