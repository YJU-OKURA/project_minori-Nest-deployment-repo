import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class SetQuizRepository {
  constructor(private readonly prisma: PrismaService) {}

  getSettedQuizzesByMId(m_id: bigint) {
    return this.prisma.setQuiz.findUnique({
      where: {
        m_id,
      },
      select: {
        deadline: true,
        quizLists: {
          select: {
            q_id: true,
            quiz: {
              select: {
                content: true,
              },
            },
          },
        },
      },
    });
  }

  getQuizzesByMId(m_id: bigint) {
    return this.prisma.quizList.findMany({
      where: {
        s_id: m_id,
      },
      select: {
        q_id: true,
      },
    });
  }

  mark(data: Prisma.ClassUserQuizCreateManyInput[]) {
    return this.prisma.classUserQuiz.createMany({
      data,
      skipDuplicates: false,
    });
  }

  getResultByNickname(
    m_id: bigint,
    nickname: string,
    page: number,
    limit: number,
  ) {
    return this.prisma.classUserQuiz.findMany({
      where: {
        s_id: m_id,
        class_user: {
          nickname: {
            contains: nickname,
          },
        },
      },
      select: {
        result: true,
        class_user: {
          select: {
            u_id: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  getResultByMId(s_id: bigint) {
    return this.prisma.classUserQuiz.findMany({
      where: {
        s_id,
      },
      select: {
        result: true,
        class_user: {
          select: {
            u_id: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  post(
    m_id: bigint,
    deadline: Date,
    data: Prisma.QuizListCreateManySetQuizInput[],
  ) {
    return this.prisma.setQuiz.create({
      data: {
        deadline,
        m_id,
        quizLists: {
          createMany: {
            data,
          },
        },
      },
    });
  }

  updatePost(
    m_id: bigint,
    deadline: Date = undefined,
    data: Prisma.QuizListCreateManySetQuizInput[] = undefined,
  ) {
    return this.prisma.setQuiz.update({
      where: {
        m_id,
      },
      data: {
        deadline,
        quizLists: data && {
          deleteMany: {},
          createMany: {
            data,
          },
        },
      },
    });
  }

  getResultByUId(u_id: bigint, m_id: bigint) {
    return this.prisma.classUserQuiz.findMany({
      where: {
        u_id,
        s_id: m_id,
      },
      select: {
        result: true,
        q_id: true,
        quizList: {
          select: {
            quiz: {
              select: {
                content: true,
              },
            },
          },
        },
      },
    });
  }

  getResults(c_id: bigint, m_id: bigint) {
    return this.prisma.classUserQuiz.findMany({
      where: {
        c_id,
        s_id: m_id,
      },
      select: {
        u_id: true,
        result: true,
      },
    });
  }

  getDeadline(m_id: bigint) {
    return this.prisma.setQuiz.findUnique({
      where: {
        m_id,
      },
      select: {
        deadline: true,
      },
    });
  }
}
