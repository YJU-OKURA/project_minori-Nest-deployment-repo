import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { KEY_OF_MODELS } from '@common/decorators/model.decorator';
import { PrismaService } from '@modules/prisma/prisma.service';

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
      KEY_OF_MODELS,
      context.getHandler(),
    );

    switch (model) {
      case 'Prompt':
        return await this.canActivatePrompt(request);
    }
  }

  async canActivatePrompt(req: Request) {
    const userId = req['user'];
    const promptId = req.params['id'];

    if (!userId || !promptId) {
      throw new UnauthorizedException(
        'Invalid user or prompt id.',
      );
    }

    const p_id = BigInt(promptId as string);
    const prompt = await this.prisma.prompt.findUnique({
      where: { id: p_id },
    });

    if (!prompt) {
      throw new UnauthorizedException('Invalid prompt id.');
    }

    return prompt.u_id === BigInt(userId);
  }
}
