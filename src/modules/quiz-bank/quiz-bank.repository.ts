import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuizBankRepository {
  constructor(private readonly prisma: PrismaService) {}

  find(id: bigint) {
    return this.prisma.quizBank.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
      },
    });
  }

  findMany(u_id: bigint, page: number, limit: number) {
    return this.prisma.quizBank.findMany({
      where: {
        u_id,
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        content: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  search(
    u_id: bigint,
    page: number,
    limit: number,
    keyword: string,
  ) {
    return this.prisma.quizBank.findMany({
      where: {
        u_id,
        title: {
          contains: keyword,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        content: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  create(
    u_id: bigint,
    title: string,
    content: Prisma.JsonValue,
  ) {
    return this.prisma.quizBank.create({
      data: {
        u_id,
        title,
        content,
      },
    });
  }

  update(
    id: bigint,
    title: string,
    content: Prisma.JsonValue,
  ) {
    return this.prisma.quizBank.update({
      where: { id },
      data: { title, content },
    });
  }

  remove(id: bigint) {
    return this.prisma.quizBank.delete({
      where: { id },
    });
  }

  getQuiz(id: bigint, c_id: bigint) {
    return this.prisma.quiz.findUnique({
      where: {
        id,
        material: {
          c_id,
        },
      },
      select: {
        content: true,
      },
    });
  }
}
