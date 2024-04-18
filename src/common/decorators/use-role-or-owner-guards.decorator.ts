import { applyDecorators, UseGuards } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { RoleOrOwnerGuard } from '@common/guards/role-or-owner.guard';
import { Key, MetaData } from './metadata.decorator';

export const UseRoleOrOwnerGuards = (
  role: Role[],
  model: Prisma.ModelName,
) => {
  return applyDecorators(
    MetaData<Prisma.ModelName>(Key.MODELS, model),
    MetaData<Role[]>(Key.ROLES, role),
    UseGuards(RoleOrOwnerGuard),
  );
};
