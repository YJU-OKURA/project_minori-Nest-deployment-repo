import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './role.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '@common/guards/role.guard';
import { ApiForbiddenResponse } from '@nestjs/swagger';

export const UseRoleGuards = (
  role: Role[] = [Role.ADMIN, Role.USER],
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
    Roles(role),
    UseGuards(RolesGuard),
    ApiForbiddenResponse({
      description:
        description ||
        'クラスにアクセスする権限がありません。',
    }),
  );
};
