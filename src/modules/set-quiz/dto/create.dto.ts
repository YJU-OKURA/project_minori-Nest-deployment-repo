import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsDate,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export const MAX_QUIZ_DATA_SIZE = 10;

@ValidatorConstraint({ async: true })
export class IsBigIntArrayConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    if (!Array.isArray(value)) return false;
    return value.every((v) => typeof v === 'bigint');
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each value in $property must be a bigint.';
  }
}

export class CreateSetQuizDto {
  @ApiProperty({
    description: '提出期限',
  })
  @Type(() => Date)
  @IsDate()
  deadline: Date;

  @ApiProperty({
    example: [1, 2, 3, 4, 5],
  })
  @Transform(
    ({ value }) => {
      return value.map((v) => BigInt(v));
    },
    {
      toClassOnly: true,
    },
  )
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(MAX_QUIZ_DATA_SIZE)
  @Validate(IsBigIntArrayConstraint)
  setQuizData: bigint[];
}
