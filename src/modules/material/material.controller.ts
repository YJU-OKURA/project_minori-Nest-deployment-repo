import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@common/guards/auth.guard';
import { Role } from '@prisma/client';
import { CreateMaterialDto } from './dto/create.dto';
import { MaterialService } from './material.service';
import { FileValidationPipe } from '@common/pipes/file.pipe';
import { UseRoleGuards } from '@common/decorators/use-role-guards.decorator';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { UpdateMaterialDto } from './dto/update.dto';
import { ApiAuthMetadata } from '@common/decorators/api-auth.decorator';
import { MaterialEntity } from './entity/material.entity';
import { ApiResponseWithBody } from '@common/decorators/api-response.decorator';
import { ApiFile } from '@common/decorators/api-file.decorator';

@UseGuards(AuthGuard)
@ApiAuthMetadata('Materials')
@Controller('materials')
export class MaterialController {
  constructor(
    private readonly materialService: MaterialService,
  ) {}

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クラスIDによって資料の総数を取得',
    '資料の総数が正常にインポートされました。',
    Number,
  )
  @Get('/count')
  @UseRoleGuards()
  async countByCid(@Param('c_id') c_id: string) {
    return this.materialService.countByCid(c_id);
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    '資料を取得',
    '資料の取得に成功しました。',
    MaterialEntity,
  )
  @Get('/:id')
  @UseRoleGuards()
  async get(@Param('id') id: string) {
    return this.materialService.get(id);
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クラスIDによる資料の取得',
    '資料の取得に成功しました。',
    MaterialEntity,
    true,
  )
  @Get()
  @UseRoleGuards()
  async getByCid(
    @Param('c_id') c_id: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.materialService.getByCid(c_id, page, limit);
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    '新しい資料の作成',
    '資料の作成に成功しました。',
    String,
  )
  @ApiBadRequestResponse({
    description:
      '資料の名称とPDFファイルデータが必要です。',
  })
  @ApiFile([
    {
      name: {
        type: 'string',
        description: '資料の名称',
      },
    },
  ])
  @Post()
  @UseRoleGuards([Role.ADMIN])
  async create(
    @Req() req: Request,
    @Body() body: CreateMaterialDto,
    @Param('c_id') c_id: string,
    @UploadedFile(new FileValidationPipe())
    file: Express.Multer.File,
  ): Promise<string> {
    return this.materialService.create(
      body.name,
      req['user'],
      c_id,
      file,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.NO_CONTENT,
    '資料の更新',
    '資料の更新に成功しました。',
    String,
  )
  @ApiBadRequestResponse({
    description:
      '資料名称、またはPDFファイルデータが必要です。',
  })
  @ApiFile([
    {
      name: {
        type: 'string',
        description: '資料の名称',
      },
    },
  ])
  @Patch('/:id')
  @UseRoleGuards([Role.ADMIN])
  async update(
    @Body() body: UpdateMaterialDto,
    @Param('id') id: string,
    @Param('c_id') c_id: string,
    @UploadedFile(new FileValidationPipe(false))
    file: Express.Multer.File,
  ) {
    return this.materialService.update(
      id,
      c_id,
      body.name,
      file,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.NO_CONTENT,
    '資料の削除',
    '資料の削除に成功しました。',
    String,
  )
  @Delete('/:id')
  @UseRoleGuards([Role.ADMIN])
  async delete(@Param('id') id: string) {
    return this.materialService.delete(id);
  }
}
