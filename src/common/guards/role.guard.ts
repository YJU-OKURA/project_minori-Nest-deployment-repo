import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { KEY_OF_ROLES } from '../decorators/role.decorator';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request>();

    const requiredRoles = this.reflector.get<Role[]>(
      KEY_OF_ROLES,
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const client = request['body']['client'];
    const c_id = request.query['c_id'];

    if (!client || !client['id'] || !c_id) {
      throw new UnauthorizedException(
        'Invalid user or class id.',
      );
    }

    const u_id = BigInt(client['id']);
    const classId = BigInt(c_id as string);

    const classUser =
      await this.authService.getClassUserInfo(
        u_id,
        classId,
      );

    if (!classUser) {
      throw new UnauthorizedException(
        'No user found with the provided class id.',
      );
    }

    return requiredRoles.includes(classUser.role);
  }
}
