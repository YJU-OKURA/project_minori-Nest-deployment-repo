import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  getByPid(
    p_id: bigint,
    page: number,
    limit: number,
  ): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        p_id,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        id: 'desc',
      },
    });
  }

  getPreviousMessage(p_id: bigint): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        p_id,
      },
      take: 2,
      orderBy: {
        id: 'desc',
      },
    });
  }

  create(
    p_id: bigint,
    question: string,
    answer: string,
  ): Promise<Pick<Message, 'id' | 'answer' | 'is_save'>> {
    return this.prisma.message.create({
      data: {
        p_id,
        question,
        answer,
      },
      select: {
        id: true,
        answer: true,
        is_save: true,
      },
    });
  }

  update(id: bigint, is_save: boolean): Promise<Message> {
    return this.prisma.message.update({
      where: {
        id,
      },
      data: {
        is_save,
      },
    });
  }

  getSavedMessages(
    id: bigint,
    page: number,
    limit: number,
  ) {
    return this.prisma.message.findMany({
      where: {
        prompt: {
          id,
        },
        is_save: true,
      },
      select: {
        id: true,
        question: true,
        answer: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
