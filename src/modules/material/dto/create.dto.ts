import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
  @IsString()
  @ApiProperty({
    description: '教材の名前',
  })
  name: string;

  @ApiProperty({
    description: '300KB以下のPDFファイル',
  })
  file: Express.Multer.File;
}
