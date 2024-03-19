import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReferRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    referInfo: {
      page: number;
      content: string;
      f_id: bigint;
      p_id: bigint;
    }[],
  ) {
    return this.prisma.refer.createMany({
      data: referInfo,
    });
  }

  getByMid(m_id: bigint) {
    return this.prisma.refer.findMany({
      where: {
        f_id: m_id,
      },
      select: {
        page: true,
        content: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 90,
    });
  }
}
