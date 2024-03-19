import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MaterialFeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}

  getByMid(m_id: bigint, page: number, limit: number) {
    return this.prisma.fileFeedback.findMany({
      where: {
        f_id: m_id,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        content: true,
      },
    });
  }

  create(m_id: bigint, content: string) {
    return this.prisma.fileFeedback.create({
      data: {
        f_id: m_id,
        content,
      },
      select: {
        id: true,
        content: true,
      },
    });
  }

  remove(id: bigint) {
    return this.prisma.fileFeedback.delete({
      where: {
        id,
      },
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
}
