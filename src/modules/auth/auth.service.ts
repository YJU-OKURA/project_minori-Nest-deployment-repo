import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { ClassUser } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * クラスユーザーを取得
   * @param u_id - ユーザーID
   * @param c_id - クラスID
   * @returns クラスユーザー
   */
  async getClassUserInfo(
    u_id: bigint,
    c_id: bigint,
  ): Promise<ClassUser> {
    return this.prisma.classUser.findUnique({
      where: {
        u_id_c_id: {
          u_id,
          c_id,
        },
      },
    });
  }
}
