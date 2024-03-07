import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePromptDto {
  @IsNotEmpty()
  @Transform(({ value }) => BigInt(value))
  @ApiProperty({
    description: '関連資料のID',
  })
  m_id: bigint;
}
