import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { QuizContent } from '../dto/create-update.dto';
import { Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class QuizEntity {
  @ApiProperty()
  @IsOptional()
  id: bigint;

  @ApiProperty({ type: () => QuizContent })
  @Type(() => QuizContent)
  content: QuizContent | Prisma.JsonValue;

  @Exclude()
  created_at: Date;

  @Exclude()
  m_id: bigint;

  constructor(partial: Partial<QuizEntity>) {
    partial.content = JSON.parse(partial.content as string);
    Object.assign(this, partial);
  }
}
