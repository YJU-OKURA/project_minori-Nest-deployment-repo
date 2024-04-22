import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptRepository {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: bigint, page: number, limit: number) {
    return this.prisma.prompt.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        messages: page &&
          limit && {
            select: {
              id: true,
              question: true,
              answer: true,
              is_save: true,
            },
            orderBy: {
              created_at: 'desc',
            },
            skip: (page - 1) * limit,
            take: limit,
          },
      },
    });
  }

  create(u_id: bigint, c_id: bigint, m_id: bigint) {
    return this.prisma.prompt.create({
      data: {
        class_user: {
          connect: {
            u_id_c_id: {
              u_id,
              c_id,
            },
          },
        },
        material: {
          connect: {
            id: m_id,
          },
        },
      },
    });
  }

  update(id: bigint, usage: number) {
    return this.prisma.prompt.update({
      where: {
        id,
      },
      data: {
        usage,
      },
    });
  }

  findFile(id: bigint) {
    return this.prisma.prompt.findUnique({
      where: {
        id,
      },
      select: {
        material: {
          select: {
            file: {
              select: {
                f_id: true,
                v_path: true,
              },
            },
          },
        },
      },
    });
  }

  isExist(u_id: bigint, c_id: bigint, m_id: bigint) {
    return this.prisma.prompt.findFirst({
      where: {
        m_id,
        class_user: {
          u_id,
          c_id,
        },
      },
    });
  }
}
