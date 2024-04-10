import { IsBigIntConstraint } from '@modules/set-quiz/dto/mark.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';

export class DeleteFeedbackDto {
  @IsNotEmpty()
  @ApiProperty()
  @Validate(IsBigIntConstraint)
  u_id: bigint;
}
