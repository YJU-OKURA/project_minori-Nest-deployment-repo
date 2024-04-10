import { ApiProperty } from '@nestjs/swagger';

class QuizContent {
  @ApiProperty({
    example: 1,
  })
  q_id: number;

  @ApiProperty({
    example: 'What is the capital of Japan?',
  })
  question: string;
}

class QuizResult {
  @ApiProperty()
  content: QuizContent;

  @ApiProperty()
  result: boolean;
}

export class QuizResultEntity {
  @ApiProperty({
    example: 100,
  })
  collectRate: number;

  @ApiProperty({
    example: [
      {
        content: {
          q_id: 1,
          question: 'What is the capital of Japan?',
        },
        result: true,
      },
    ],
  })
  results: QuizResult[];
}
