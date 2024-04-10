import { ApiProperty } from '@nestjs/swagger';

export class StatisticsClassEntity {
  @ApiProperty({
    example: 80,
  })
  attendRate: number;

  @ApiProperty({
    example: 100,
  })
  collectRate: number;
}
