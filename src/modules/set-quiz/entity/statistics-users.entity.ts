import { ApiProperty } from '@nestjs/swagger';

export class StatisticsUsersEntity {
  @ApiProperty({
    example: 1,
  })
  u_id: number;

  @ApiProperty({
    example: 'Z00One',
  })
  nickname: string;

  @ApiProperty({
    example: 100,
  })
  collectRate: number;
}
