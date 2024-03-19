import { ApiProperty } from '@nestjs/swagger';

export class KeywordEntity {
  @ApiProperty()
  page: bigint;

  @ApiProperty({
    example: ['구글', '앤스로픽', 'AI'],
    type: 'array',
    isArray: true,
  })
  keywords: string[];
}
