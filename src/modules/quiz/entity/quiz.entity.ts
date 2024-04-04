import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CreateUpdateQuizDto } from '../dto/create-update.dto';

export class QuizEntity {
  @ApiProperty()
  id: bigint;

  @ApiProperty({ type: () => CreateUpdateQuizDto })
  content: CreateUpdateQuizDto;

  @Exclude()
  created_at: Date;

  @Exclude()
  m_id: bigint;

  constructor(partial: Partial<QuizEntity>) {
    Object.assign(this, partial);
  }
}
