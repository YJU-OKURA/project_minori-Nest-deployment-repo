import { IsBigIntConstraint } from '@modules/set-quiz/dto/mark.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Validate,
} from 'class-validator';

export class CreateAndUpdateFeedbackDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @ApiProperty()
  @Validate(IsBigIntConstraint)
  u_id: bigint;
}
