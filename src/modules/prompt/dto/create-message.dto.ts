import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const MAX_LENGTH = 600;

export class CreateMessageDto {
  @ApiProperty({
    description: 'プロンプトのメッセージ',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(MAX_LENGTH)
  message: string;
}
