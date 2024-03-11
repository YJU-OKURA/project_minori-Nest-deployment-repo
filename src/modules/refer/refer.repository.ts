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
}
