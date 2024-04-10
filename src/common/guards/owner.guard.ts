import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Key } from '@common/decorators/metadata.decorator';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request>();

    const model = this.reflector.get<Prisma.ModelName>(
      Key.MODELS,
      context.getHandler(),
    );

    const idParamName = this.reflector.get<string>(
      Key.ID_PARAM,
      context.getHandler(),
    );

    return await this.checkOwnership(
      request,
      model,
      idParamName,
    );
  }

  private async checkOwnership(
    req: Request,
    modelName: Prisma.ModelName,
    idParamName: string,
  ): Promise<boolean> {
    const userId = req['user'];
    const resourceId = req.params[idParamName];

    if (!userId || !resourceId) {
      throw new UnauthorizedException(
        'Invalid user or parameter.',
      );
    }

    const resource = await this.prisma[modelName].findFirst(
      {
        where: { [idParamName]: BigInt(resourceId) },
      },
    );

    if (!resource) {
      throw new NotFoundException(
        `Invalid ${idParamName}.`,
      );
    }

    return resource[idParamName] === BigInt(userId);
  }
}
