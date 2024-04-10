import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizFeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(m_id: bigint, page: number, limit: number) {
    return this.prisma.quizFeedback.findMany({
      where: {
        s_id: m_id,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        content: true,
        created_at: true,
        class_user: {
          select: {
            u_id: true,
            nickname: true,
          },
        },
      },
    });
  }

  findOne(u_id: bigint, c_id: bigint, m_id: bigint) {
    return this.prisma.quizFeedback.findUnique({
      where: {
        u_id_c_id_s_id: {
          u_id,
          c_id,
          s_id: m_id,
        },
      },
      select: {
        content: true,
        created_at: true,
        class_user: {
          select: {
            u_id: true,
            nickname: true,
          },
        },
      },
    });
  }

  findManyByNickname(
    m_id: bigint,
    nickname: string,
    page: number,
    limit: number,
  ) {
    return this.prisma.quizFeedback.findMany({
      where: {
        s_id: m_id,
        class_user: {
          nickname: {
            contains: nickname,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      select: {
        content: true,
        created_at: true,
        class_user: {
          select: {
            u_id: true,
            nickname: true,
          },
        },
      },
    });
  }

  isSolved(u_id: bigint, c_id: bigint, m_id: bigint) {
    return this.prisma.classUserQuiz.findFirstOrThrow({
      where: {
        u_id,
        c_id,
        s_id: m_id,
      },
    });
  }

  isExist(u_id: bigint, c_id: bigint, m_id: bigint) {
    return this.prisma.quizFeedback.findFirst({
      where: {
        u_id,
        c_id,
        s_id: m_id,
      },
    });
  }

  create(
    u_id: bigint,
    c_id: bigint,
    m_id: bigint,
    content: string,
  ) {
    return this.prisma.quizFeedback.create({
      data: {
        u_id,
        c_id,
        s_id: m_id,
        content,
      },
    });
  }

  update(
    u_id: bigint,
    c_id: bigint,
    m_id: bigint,
    content: string,
  ) {
    return this.prisma.quizFeedback.update({
      where: {
        u_id_c_id_s_id: {
          u_id,
          c_id,
          s_id: m_id,
        },
      },
      data: {
        content,
      },
    });
  }

  remove(u_id: bigint, c_id: bigint, m_id: bigint) {
    return this.prisma.quizFeedback.delete({
      where: {
        u_id_c_id_s_id: {
          u_id,
          c_id,
          s_id: m_id,
        },
      },
    });
  }
}
