import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { VALUE_FOR_RECEIVED_COUNT } from './material-feedback.service';

@Injectable()
export class MaterialFeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}

  getByMid(m_id: bigint, page: number, limit: number) {
    return this.prisma.fileFeedback.findMany({
      where: {
        f_id: m_id,
        is_saved: true,
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
        is_saved: true,
      },
      select: {
        id: true,
        content: true,
      },
    });
  }

  remove(id: bigint) {
    return this.prisma.fileFeedback.update({
      where: {
        id,
      },
      data: {
        is_saved: false,
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

  createCount(m_id: bigint) {
    return this.prisma.fileFeedback.create({
      data: {
        f_id: m_id,
        content: VALUE_FOR_RECEIVED_COUNT,
      },
    });
  }

  getRreceivedCount(m_id: bigint) {
    return this.prisma.fileFeedback.count({
      where: {
        f_id: m_id,
        is_saved: false,
      },
    });
  }
}
