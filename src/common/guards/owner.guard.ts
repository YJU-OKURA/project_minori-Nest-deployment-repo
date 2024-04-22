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

    return await this.checkOwnership(request, model);
  }

  private async checkOwnership(
    req: Request,
    modelName: Prisma.ModelName,
  ): Promise<boolean> {
    const userId = req['user'];
    const resourceInfo = req.params;

    if (!userId || !resourceInfo) {
      throw new UnauthorizedException(
        'Invalid user or parameter.',
      );
    }

    const uId = await this.getUIdFromResouce(
      modelName,
      resourceInfo,
    );

    if (!uId) {
      throw new NotFoundException('Resource not found.');
    }

    return BigInt(uId) === BigInt(userId);
  }

  private async getUIdFromResouce(
    modelName: Prisma.ModelName,
    resourceinfo: any,
  ) {
    const findResource = async (whereCondition: any) => {
      const resource = await this.prisma[
        modelName
      ].findFirst({
        where: whereCondition,
      });
      return resource?.u_id;
    };

    switch (modelName) {
      case Prisma.ModelName.Prompt:
        return await findResource({
          id: BigInt(resourceinfo['id']),
        });
      case Prisma.ModelName.QuizFeedback:
        return await findResource({
          u_id_c_id_s_id: {
            u_id: BigInt(resourceinfo['u_id']),
            c_id: BigInt(resourceinfo['c_id']),
            s_id: BigInt(resourceinfo['s_id']),
          },
        });
      case Prisma.ModelName.ClassUserQuiz:
        return await findResource({
          u_id: BigInt(resourceinfo['u_id']),
          s_id: BigInt(resourceinfo['m_id']),
        });
      case Prisma.ModelName.QuizBank:
        return await findResource({
          id: BigInt(resourceinfo['id']),
        });
      default:
        return null;
    }
  }
}
