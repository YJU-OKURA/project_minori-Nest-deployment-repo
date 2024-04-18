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

  findMany(
    c_id: bigint,
    u_id: bigint,
    page: number,
    limit: number,
  ) {
    return this.prisma.quizBank.findMany({
      where: {
        class_user: {
          c_id,
          u_id,
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

  search(
    c_id: bigint,
    u_id: bigint,
    page: number,
    limit: number,
    keyword: string,
  ) {
    return this.prisma.quizBank.findMany({
      where: {
        c_id,
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
    c_id: bigint,
    u_id: bigint,
    title: string,
    content: Prisma.JsonValue,
  ) {
    return this.prisma.quizBank.create({
      data: {
        c_id,
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
}
