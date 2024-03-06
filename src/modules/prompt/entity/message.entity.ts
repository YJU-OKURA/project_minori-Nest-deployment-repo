import { ApiProperty } from '@nestjs/swagger';

export class MessageEntity {
  @ApiProperty({
    example: 'bigInt',
  })
  id: bigint;

  @ApiProperty({
    example: 'string',
  })
  answer: string;

  @ApiProperty({
    example: 'string',
  })
  is_save: string;

  constructor(partial: Partial<MessageEntity>) {
    Object.assign(this, partial);
  }
}
