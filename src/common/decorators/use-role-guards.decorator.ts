import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { RolesGuard } from '@common/guards/role.guard';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { Key, MetaData } from './metadata.decorator';

export const UseRoleGuards = (
  role: Role[] = [Role.ADMIN, Role.USER, Role.ASSISTANT],
  description: string = undefined,
) => {
  if (
    role.length == 1 &&
    role.includes(Role.ADMIN) &&
    !description
  ) {
    description = '管理者権限が必要です。';
  }
  return applyDecorators(
    MetaData<Role[]>(Key.ROLES, role),
    UseGuards(RolesGuard),
    ApiForbiddenResponse({
      description:
        description || 'アクセスする権限がありません。',
    }),
  );
};
