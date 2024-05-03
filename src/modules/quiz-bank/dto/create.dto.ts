import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateQuizBankDto {
  @IsNotEmpty()
  @Transform(({ value }) => BigInt(value))
  @ApiProperty({
    description: 'クイズのID',
  })
  q_id: bigint;
}
