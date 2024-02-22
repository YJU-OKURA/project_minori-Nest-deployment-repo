import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { Class_user } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get class user
   * @returns Class_users
   */
  async getClassUserInfo(
    u_id: bigint,
    c_id: bigint,
  ): Promise<Class_user> {
    return this.prisma.class_user.findUnique({
      where: {
        u_id_c_id: {
          u_id,
          c_id,
        },
      },
    });
  }
}
