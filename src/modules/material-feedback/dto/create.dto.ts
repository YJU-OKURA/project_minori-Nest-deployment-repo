import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialFeedbackDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'フィードバックの内容',
  })
  content: string;
}
