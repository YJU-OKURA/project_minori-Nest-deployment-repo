import { ApiDefaultMetadata } from '@common/decorators/api-default.decorator';
import { ApiResponseWithBody } from '@common/decorators/api-response.decorator';
import { UseRoleGuards } from '@common/decorators/use-role-guards.decorator';
import { BigIntPipe } from '@common/pipes/bigint.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { MaterialFeedbackService } from './material-feedback.service';
import { Response } from 'express';
import { KeywordEntity } from './entity/keyword.entity';
import { CreateMaterialFeedbackDto } from './dto/create.dto';
import { MaterialFeedBackEntity } from './entity/feedback.entity';
import {
  FeedbackType,
  FeedbackTypePipe,
} from '@common/pipes/feedback-type.pipe';

@ApiDefaultMetadata('MaterialFeedbacks')
@Controller('feedback/materials/:m_id')
export class MaterialFeedbackController {
  constructor(
    private readonly materialFeedbackService: MaterialFeedbackService,
  ) {}

  @ApiResponseWithBody(
    HttpStatus.OK,
    'フィードバック取得',
    'フィードバック取得に成功しました。',
    MaterialFeedBackEntity,
    true,
  )
  @UseRoleGuards([Role.ADMIN, Role.ASSISTANT])
  @Get()
  getByMid(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.materialFeedbackService.getByMid(
      m_id,
      page,
      limit,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    '参照されたページのうち上位3ページのキーワードを取得',
    '参照されたページのうち上位3ページのキーワードを取得に成功しました。',
    KeywordEntity,
    true,
  )
  @UseRoleGuards([Role.ADMIN, Role.ASSISTANT])
  @Get('get-keyword')
  getKeyword(@Param('m_id', BigIntPipe) m_id: bigint) {
    return this.materialFeedbackService.getKeyword(m_id);
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    '参照データの有無を確認',
    '参照データの有無を確認に成功しました。',
    Boolean,
  )
  @UseRoleGuards([Role.ADMIN])
  @Get('check-refer')
  checkRefer(@Param('m_id', BigIntPipe) m_id: bigint) {
    return this.materialFeedbackService.checkRefer(m_id);
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'フィードバックをストリーミングを通じて取得',
    'フィードバックの取得に成功しました。',
  )
  @UseRoleGuards([Role.ADMIN])
  @Get('get-feedback')
  async getFeedback(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Query('type', FeedbackTypePipe) type: FeedbackType,
    @Res() response: Response,
  ) {
    await this.materialFeedbackService.getFeedback(
      m_id,
      type,
      response,
    );
    response.end();
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'フィードバックの作成',
    'フィードバックの作成に成功しました。',
    MaterialFeedBackEntity,
  )
  @UseRoleGuards([Role.ADMIN])
  @Post()
  create(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Body() content: CreateMaterialFeedbackDto,
  ) {
    return this.materialFeedbackService.create(
      m_id,
      content.content,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.NO_CONTENT,
    'フィードバックの削除',
    'フィードバックの削除に成功しました。',
  )
  @Delete()
  @UseRoleGuards([Role.ADMIN])
  remove(@Param('m_id', BigIntPipe) m_id: bigint) {
    return this.materialFeedbackService.remove(m_id);
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    '受信できるフィードバックの数',
    '受信できるフィードバックの数を取得しました。',
    Number,
  )
  @UseRoleGuards([Role.ADMIN])
  @Get('get-feedback-counts-remaining')
  getRemainingFeedbackCounts(
    @Param('m_id', BigIntPipe) m_id: bigint,
  ) {
    return this.materialFeedbackService.getRemainingFeedbackCounts(
      m_id,
    );
  }
}
