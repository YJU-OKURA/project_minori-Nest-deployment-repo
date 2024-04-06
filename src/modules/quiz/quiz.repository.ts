import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuizRepository {
  constructor(private readonly prisma: PrismaService) {}

  getByMid(m_id: bigint, page: number, limit: number) {
    return this.prisma.quiz.findMany({
      where: {
        m_id,
      },
      select: {
        id: true,
        content: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  getFilePath(m_id: bigint) {
    return this.prisma.file.findUnique({
      where: {
        f_id: m_id,
      },
      select: {
        m_path: true,
      },
    });
  }

  create(m_id: bigint, content: Prisma.JsonValue) {
    return this.prisma.quiz.create({
      data: {
        m_id,
        content,
      },
    });
  }

  update(id: bigint, content: Prisma.JsonValue) {
    return this.prisma.quiz.update({
      where: {
        id,
      },
      data: {
        content,
      },
      select: {
        id: true,
        content: true,
      },
    });
  }

  remove(id: bigint) {
    return this.prisma.quiz.delete({
      where: {
        id,
      },
    });
  }
}
