import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@common/guards/auth.guard';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateMaterialDto } from './dto/create.dto';
import { MaterialService } from './material.service';
import { FileValidationPipe } from '@common/pipes/file.pipe';
import { UseRoleGuards } from '@common/decorators/use-role-guards.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateMaterialDto } from './dto/update.dto';
import { ApiAuthMetadata } from '@common/decorators/api-auth.operator';
import { MaterialEntity } from './entity/material.entity';
import { ResponseFormat } from '@common/utils/response.util';
import { ApiResponseWithBody } from '@common/decorators/api-response';

@UseGuards(AuthGuard)
@ApiAuthMetadata('Materials')
@ApiExtraModels(ResponseFormat)
@Controller('class/:c_id/materials')
export class MaterialController {
  constructor(
    private readonly materialService: MaterialService,
  ) {}

  @ApiResponseWithBody(
    { summary: 'クラスIDによって資料の総数を取得' },
    {
      status: 200,
      description:
        '資料の総数が正常にインポートされました。',
    },
    Number,
  )
  @Get('/count')
  @UseRoleGuards()
  async countByCid(@Param('c_id') c_id: string) {
    console.log(c_id);
    return this.materialService.countByCid(c_id);
  }

  @ApiResponseWithBody(
    { summary: '資料を取得' },
    {
      status: 200,
      description: '資料の取得に成功しました。',
    },
    MaterialEntity,
  )
  @Get('/:id')
  @UseRoleGuards()
  @ApiParam({
    name: 'c_id',
    required: true,
  })
  async get(@Param('id') id: string) {
    return this.materialService.get(id);
  }

  @ApiResponseWithBody(
    { summary: 'クラスIDによる資料の取得' },
    {
      status: 200,
      description: '資料の取得に成功しました。',
    },
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
    { summary: '新しい資料の作成' },
    {
      status: 201,
      description: '資料の作成に成功しました。',
    },
    String,
  )
  @ApiBadRequestResponse({
    description:
      '資料の名称とPDFファイルデータが必要です。',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateMaterialDto,
    description:
      '資料の名称とPDFファイルデータが必要です。',
  })
  @Post()
  @UseRoleGuards([Role.ADMIN])
  @UseInterceptors(FileInterceptor('file'))
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
    { summary: '資料の更新' },
    {
      status: 204,
      description: '資料の更新に成功しました。',
    },
    String,
  )
  @ApiBadRequestResponse({
    description:
      '資料名称、またはPDFファイルデータが必要です。',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateMaterialDto,
    description:
      '資料名称、またはPDFファイルデータが必要です。',
  })
  @Patch('/:id')
  @UseRoleGuards([Role.ADMIN])
  @UseInterceptors(FileInterceptor('file'))
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
    { summary: '資料の削除' },
    {
      status: 204,
      description: '資料の削除に成功しました。',
    },
    String,
  )
  @ApiParam({
    name: 'c_id',
    required: true,
  })
  @Delete('/:id')
  @UseRoleGuards([Role.ADMIN])
  async delete(@Param('id') id: string) {
    return this.materialService.delete(id);
  }
}
