import { ApiProperty } from '@nestjs/swagger';

export class MaterialFeedBackEntity {
  @ApiProperty()
  id: bigint;

  @ApiProperty()
  content: string;
}
