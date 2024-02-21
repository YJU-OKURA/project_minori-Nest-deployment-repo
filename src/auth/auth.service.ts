import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Class_users } from '@prisma/client';

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
  ): Promise<Class_users> {
    return this.prisma.class_users.findUnique({
      where: {
        u_id_c_id: {
          u_id,
          c_id,
        },
      },
    });
  }
}
