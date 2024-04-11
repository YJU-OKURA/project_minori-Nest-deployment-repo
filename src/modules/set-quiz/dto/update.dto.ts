// import {
//   ArrayMaxSize,
//   ArrayNotEmpty,
//   IsArray,
//   IsDate,
//   IsOptional,
//   Validate,
// } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';
// import { Transform, Type } from 'class-transformer';
// import {
//   IsBigIntArrayConstraint,
//   MAX_QUIZ_DATA_SIZE,
// } from './create.dto';

// export class UpdateSetQuizDto {
//   @IsOptional()
//   @ApiProperty({
//     description: '提出期限',
//   })
//   @Type(() => Date)
//   @IsDate()
//   deadline: Date;

//   @IsOptional()
//   @ApiProperty({
//     example: [1, 2, 3, 4, 5],
//   })
//   @Transform(
//     ({ value }) => {
//       return value.map((v) => BigInt(v));
//     },
//     {
//       toClassOnly: true,
//     },
//   )
//   @IsArray()
//   @ArrayNotEmpty()
//   @ArrayMaxSize(MAX_QUIZ_DATA_SIZE)
//   @Validate(IsBigIntArrayConstraint)
//   setQuizData: bigint[];
// }

import { CreateSetQuizDto } from './create.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSetQuizDto extends CreateSetQuizDto {
  @IsOptional()
  @ApiProperty({
    description: '제출 기한',
  })
  deadline: Date;

  @IsOptional()
  @ApiProperty({
    example: [1, 2, 3, 4, 5],
  })
  setQuizData: bigint[];
}
