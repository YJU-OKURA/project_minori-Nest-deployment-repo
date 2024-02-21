import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const KEY_OF_ROLES = 'roles';

export const Roles = (
  roles: Role[] = [Role.ADMIN, Role.USER],
) => SetMetadata(KEY_OF_ROLES, roles);
