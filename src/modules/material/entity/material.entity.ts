import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class MaterialEntity {
  @ApiProperty()
  id: bigint;

  @ApiProperty()
  m_path: string;

  @ApiProperty()
  name: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @ApiProperty({
    example: [
      {
        id: 0,
      },
    ],
    type: 'array',
    isArray: true,
  })
  prompts: { id: bigint }[];

  @Exclude()
  quiz_deadline?: Date;

  @Exclude()
  u_id?: bigint;

  @Exclude()
  c_id: bigint;

  @Exclude()
  v_path: string;

  constructor(partial: Partial<MaterialEntity>) {
    Object.assign(this, partial);
  }
}
