import { ApiProperty } from '@nestjs/swagger';

export class PromptEntity {
  @ApiProperty()
  id: bigint;

  @ApiProperty()
  message: string;
  @ApiProperty({
    example: [
      {
        id: 'bigInt',
        question: 'string',
        answer: 'string',
        is_save: 'boolean',
      },
    ],
    type: 'array',
    isArray: true,
  })
  prompts: { id: bigint }[];

  constructor(partial: Partial<PromptEntity>) {
    Object.assign(this, partial);
  }
}
