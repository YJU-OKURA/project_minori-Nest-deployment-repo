import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { OwnerGuard } from './owner.guard';
import { RolesGuard } from './role.guard';

@Injectable()
export class RoleOrOwnerGuard implements CanActivate {
  constructor(
    private readonly ownerGuard: OwnerGuard,
    private readonly roleGuard: RolesGuard,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const hasRole = await this.checkUserRole(context);
    if (hasRole) return true;

    const isOwner = await this.checkOwnership(context);
    if (isOwner) return true;

    return false;
  }

  private checkUserRole(context: ExecutionContext) {
    return this.roleGuard.canActivate(context);
  }

  private checkOwnership(context: ExecutionContext) {
    return this.ownerGuard.canActivate(context);
  }
}
