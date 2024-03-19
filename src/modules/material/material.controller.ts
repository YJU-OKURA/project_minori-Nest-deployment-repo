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
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateMaterialDto } from './dto/create.dto';
import { MaterialService } from './material.service';
import { FileValidationPipe } from '@common/pipes/file.pipe';
import { UseRoleGuards } from '@common/decorators/use-role-guards.decorator';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { UpdateMaterialDto } from './dto/update.dto';
import { ApiDefaultMetadata } from '@common/decorators/api-default.decorator';
import { MaterialEntity } from './entity/material.entity';
import { ApiResponseWithBody } from '@common/decorators/api-response.decorator';
import { ApiFile } from '@common/decorators/api-file.decorator';
import { BigIntPipe } from '@common/pipes/bigint.pipe';
import { User } from '@common/decorators/user.decorator';

@ApiDefaultMetadata('Materials')
@Controller('materials')
export class MaterialController {
  constructor(
    private readonly materialService: MaterialService,
  ) {}

  @ApiResponseWithBody(
    HttpStatus.OK,
    '資料の検索',
    '資料の検索に成功しました。',
    MaterialEntity,
    true,
  )
  @Get('search')
  @UseRoleGuards()
  search(
    @User() u_id: bigint,
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Query('name') name: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.materialService.search(
      u_id,
      c_id,
      name,
      page,
      limit,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クラスIDによって資料の総数を取得',
    '資料の総数が正常にインポートされました。',
    Number,
  )
  @Get('/count')
  @UseRoleGuards()
  countByCid(@Param('c_id', BigIntPipe) c_id: bigint) {
    return this.materialService.countByCid(c_id);
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
  getByCid(
    @User() u_id: bigint,
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.materialService.getByCid(
      u_id,
      c_id,
      page,
      limit,
    );
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
  create(
    @User() u_id: bigint,
    @Body() body: CreateMaterialDto,
    @Param('c_id', BigIntPipe) c_id: bigint,
    @UploadedFile(new FileValidationPipe())
    file: Express.Multer.File,
  ): Promise<string> {
    return this.materialService.create(
      body.name,
      u_id,
      c_id,
      file,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.NO_CONTENT,
    '資料の更新',
    '資料の更新に成功しました。',
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
  update(
    @Body() body: UpdateMaterialDto,
    @Param('id', BigIntPipe) id: bigint,
    @Param('c_id', BigIntPipe) c_id: bigint,
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
  )
  @Delete('/:id')
  @UseRoleGuards([Role.ADMIN])
  remove(@Param('id', BigIntPipe) id: bigint) {
    return this.materialService.remove(id);
  }
}
