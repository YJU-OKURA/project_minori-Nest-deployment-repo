import { Injectable } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { ClassUser, Role } from '@prisma/client';

@Injectable()
export class ClassUserRepository {
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

  /**
   * クラスのユーザーたちを取得
   * @param c_id - クラスID
   * @param page - ページ
   * @param limit - 1ページあたりの表示数
   * @returns クラスのユーザーたち
   */
  getClassUsersInfo(
    c_id: bigint,
    page: number = undefined,
    limit: number = undefined,
  ) {
    return this.prisma.classUser.findMany({
      where: {
        c_id,
        role: Role.USER,
      },
      skip: page && (page - 1) * limit,
      take: limit && limit,
      select: {
        u_id: true,
        nickname: true,
        user: {
          select: {
            image: true,
          },
        },
      },
      orderBy: {
        u_id: 'asc',
      },
    });
  }

  /**
   * ニックネームでクラスのユーザーたちを取得
   * @param c_id - クラスID
   * @param nickname - ニックネーム
   * @param page - ページ
   * @param limit - 1ページあたりの表示数
   * @returns クラスのユーザーたち
   */
  getClassUsersByNickname(
    c_id: bigint,
    nickname: string,
    page: number,
    limit: number,
  ) {
    return this.prisma.classUser.findMany({
      where: {
        c_id,
        nickname: {
          contains: nickname,
        },
      },
      select: {
        u_id: true,
        nickname: true,
      },
      orderBy: {
        u_id: 'asc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
