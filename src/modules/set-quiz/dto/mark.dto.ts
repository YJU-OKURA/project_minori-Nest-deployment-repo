import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { MAX_QUIZ_DATA_SIZE } from './create.dto';

@ValidatorConstraint({ async: true })
class IsQuizResultArrayConstraint {
  async validate(value: any) {
    if (!Array.isArray(value)) return false;
    return value.every(
      (v) =>
        typeof v.q_id === 'bigint' &&
        typeof v.result === 'boolean',
    );
  }

  defaultMessage() {
    return 'Each value in $property must be an object with q_id and result.';
  }
}

@ValidatorConstraint({ async: true })
class IsBigIntConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    try {
      value = BigInt(value);
    } catch (error) {
      return false;
    }
    return typeof value === 'bigint';
  }

  defaultMessage(args: ValidationArguments) {
    return '$property must be a value that can be converted to a bigint.';
  }
}

export class QuizResult {
  @IsNotEmpty()
  @Transform(({ value }) => BigInt(value), {
    toClassOnly: true,
  })
  @Validate(IsBigIntConstraint)
  @ApiProperty({
    example: 1,
  })
  q_id: bigint;

  @Type(() => Boolean)
  @IsBoolean()
  @ApiProperty({
    example: true,
  })
  result: boolean;
}

export class MarkSetQuizDto {
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: '提出期限',
  })
  created_at: Date;

  @ValidateNested()
  @ArrayNotEmpty()
  @ArrayMaxSize(MAX_QUIZ_DATA_SIZE)
  @Type(() => QuizResult)
  @Validate(IsQuizResultArrayConstraint)
  @ApiProperty({
    type: QuizResult,
    example: [
      {
        q_id: 1,
        result: true,
      },
    ],
  })
  quizResults: QuizResult[];
}
