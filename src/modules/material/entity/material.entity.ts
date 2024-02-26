import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class MaterialEntity {
  @ApiProperty()
  id: bigint;

  @ApiProperty()
  m_path: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ nullable: true })
  quiz_deadline?: Date;

  @ApiProperty({ nullable: true })
  u_id?: bigint;

  @ApiProperty()
  c_id: bigint;

  @Exclude()
  v_path: string;

  constructor(partial: Partial<MaterialEntity>) {
    Object.assign(this, partial);
  }
}
