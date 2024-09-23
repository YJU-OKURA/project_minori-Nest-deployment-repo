import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Answer {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Tokyo',
  })
  a: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Osaka',
  })
  b: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Kyoto',
  })
  c: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Hokkaido',
  })
  d: string;
}

class Commentary {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'a' })
  correctAnswer: keyof Answer;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Tokyo is the capital of Japan.',
  })
  content: string;
}

export class QuizContent {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'What is the capital of Japan?',
  })
  question: string;

  @ValidateNested()
  @Type(() => Answer)
  @IsNotEmpty()
  @ApiProperty({ type: Answer })
  answer: Answer;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => Commentary)
  @ApiProperty({ type: Commentary })
  commentary: Commentary;
}

export class CreateQuizzesDto {
  @ArrayNotEmpty()
  @ArrayMaxSize(5)
  @Type(() => QuizContent)
  @ValidateNested()
  @ApiProperty({
    type: [QuizContent],
  })
  content: QuizContent[];
}

export class UpdateQuizDto {
  @IsNotEmpty()
  @Type(() => QuizContent)
  @ApiProperty({
    type: QuizContent,
  })
  content: QuizContent;
}
