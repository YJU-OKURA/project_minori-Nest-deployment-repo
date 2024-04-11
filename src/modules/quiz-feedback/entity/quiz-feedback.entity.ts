import { ApiProperty } from '@nestjs/swagger';

class ClassUser {
  @ApiProperty({
    example: 1,
  })
  u_id: bigint;

  @ApiProperty({
    example: 'user1',
  })
  nickname: string;
}

export class QuizFeedbackEntity {
  @ApiProperty({
    example: '理解度が高いですね、お疲れ様でした😊',
  })
  content: string;

  @ApiProperty({
    example: '2021-08-30T06:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    type: ClassUser,
  })
  class_user: ClassUser;
}
