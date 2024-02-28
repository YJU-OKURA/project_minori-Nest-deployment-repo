import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMaterialDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '教材の名前',
    required: false,
  })
  name: string;

  @ApiProperty({
    description: '300KB以下のPDFファイル',
    required: false,
  })
  @IsOptional()
  file: Express.Multer.File;
}
