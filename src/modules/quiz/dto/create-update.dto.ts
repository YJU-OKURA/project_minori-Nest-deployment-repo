import {
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Answer {
  @IsString()
  @ApiProperty({
    example: 'Tokyo',
  })
  a: string;

  @IsString()
  @ApiProperty({
    example: 'Osaka',
  })
  b: string;

  @IsString()
  @ApiProperty({
    example: 'Kyoto',
  })
  c: string;

  @IsString()
  @ApiProperty({
    example: 'Hokkaido',
  })
  d: string;
}

class Commentary {
  @IsString()
  @ApiProperty({ example: 'a' })
  correctAnswer: keyof Answer;

  @IsString()
  @ApiProperty({
    example: 'Tokyo is the capital of Japan.',
  })
  content: string;
}

export class QuizContent {
  @IsString()
  @ApiProperty({
    example: 'What is the capital of Japan?',
  })
  question: string;

  @ValidateNested()
  @Type(() => Answer)
  @ApiProperty({ type: Answer })
  answer: Answer;

  @ValidateNested()
  @Type(() => Commentary)
  @ApiProperty({ type: Commentary })
  commentary: Commentary;
}

export class CreateUpdateQuizDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => QuizContent)
  @ApiProperty({
    type: QuizContent,
  })
  content: QuizContent;
}
