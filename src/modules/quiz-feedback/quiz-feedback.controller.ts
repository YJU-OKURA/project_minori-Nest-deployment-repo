import { ApiResponseWithBody } from '@common/decorators/api-response.decorator';
import { UseRoleGuards } from '@common/decorators/use-role-guards.decorator';
import { UseRoleOrOwnerGuards } from '@common/decorators/use-role-or-owner-guards.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { QuizFeedbackService } from './quiz-feedback.service';
import { BigIntPipe } from '@common/pipes/bigint.pipe';
import { ApiDefaultMetadata } from '@common/decorators/api-default.decorator';
import { QuizFeedbackEntity } from './entity/quiz-feedback.entity';
import { CreateAndUpdateFeedbackDto } from './dto/create-update.dto';
import { DeleteFeedbackDto } from './dto/delete.dto';

@ApiDefaultMetadata('quizFeedbacks')
@Controller('material/:m_id/quiz-feedback')
export class QuizFeedbackController {
  constructor(
    private readonly quizFeedBackService: QuizFeedbackService,
  ) {}

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クイズフィードバック取得',
    'クイズフィードバック取得に成功しました。',
    QuizFeedbackEntity,
    true,
  )
  @UseRoleGuards([Role.ADMIN])
  @Get()
  getFeedbacks(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.quizFeedBackService.getFeedbacks(
      m_id,
      page,
      limit,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'ユーザーのIDでクイズフィードバック取得',
    'ユーザーのIDでクイズフィードバック取得に成功しました。',
    QuizFeedbackEntity,
  )
  @UseRoleOrOwnerGuards([Role.ADMIN], 'QuizFeedback')
  @Get('user/:u_id')
  getFeedback(
    @Param('u_id', BigIntPipe) u_id: bigint,
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Param('m_id', BigIntPipe) m_id: bigint,
  ) {
    return this.quizFeedBackService.getFeedback(
      u_id,
      c_id,
      m_id,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'ユーザーのニックネームでクイズフィードバック取得',
    'ユーザーのニックネームでクイズフィードバック取得に成功しました。',
    QuizFeedbackEntity,
    true,
  )
  @UseRoleGuards([Role.ADMIN])
  @Get('user')
  getFeedbacksByNickname(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Query('nickname') nickname: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.quizFeedBackService.getFeedbacksByNickname(
      m_id,
      nickname,
      page,
      limit,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'クイズフィードバック作成',
    'クイズフィードバック作成に成功しました。',
  )
  @UseRoleGuards([Role.ADMIN])
  @Post()
  createFeedback(
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Body() body: CreateAndUpdateFeedbackDto,
  ) {
    return this.quizFeedBackService.createFeedback(
      body.u_id,
      c_id,
      m_id,
      body.content,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'クイズフィードバック更新',
    'クイズフィードバック更新に成功しました。',
  )
  @UseRoleGuards([Role.ADMIN])
  @Patch()
  updateFeedback(
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Body() body: CreateAndUpdateFeedbackDto,
  ) {
    return this.quizFeedBackService.updateFeedback(
      body.u_id,
      c_id,
      m_id,
      body.content,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.NO_CONTENT,
    'クイズフィードバック削除',
    'クイズフィードバック削除に成功しました。',
  )
  @UseRoleGuards([Role.ADMIN])
  @Delete()
  deleteFeedback(
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Body() body: DeleteFeedbackDto,
  ) {
    return this.quizFeedBackService.deleteFeedback(
      body.u_id,
      c_id,
      m_id,
    );
  }
}
