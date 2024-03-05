import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '資料の名前',
  })
  name: string;

  @ApiProperty({
    description: '10MB以下のPDFファイル',
  })
  file: Express.Multer.File;
}
