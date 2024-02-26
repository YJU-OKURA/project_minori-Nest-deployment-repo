import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new BadRequestException(
        'Token is not found in the header.',
      );
    }

    try {
      await this.jwtService.verifyAsync(token);

      const { id } = this.jwtService.decode<{ id: bigint }>(
        token,
      );

      request['user'] = String(id);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Token is expired.',
        );
      }

      throw new UnauthorizedException('Invalid token.');
    }

    return true;
  }

  private extractTokenFromHeader(
    request: Request,
  ): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException(
        'Authorization header is not found.',
      );
    }

    try {
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    } catch (error) {
      throw new UnprocessableEntityException(
        'Invalid token.',
      );
    }
  }
}
