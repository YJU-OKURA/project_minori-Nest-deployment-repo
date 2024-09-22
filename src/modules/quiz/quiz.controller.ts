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
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { QuizService } from './quiz.service';
import { ApiDefaultMetadata } from '@common/decorators/api-default.decorator';
import {
  CreateQuizzesDto,
  QuizContent,
  UpdateQuizDto,
} from './dto/create-update.dto';
import { QuizEntity } from './entity/quiz.entity';

@ApiDefaultMetadata('Quizzes')
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クイズ取得',
    'クイズ取得に成功しました。',
    QuizEntity,
    true,
  )
  @UseRoleGuards()
  @Get('material/:m_id')
  getByMid(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.quizService.getByMid(m_id, page, limit);
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'クイズ作成',
    'クイズ作成に成功しました。',
    String,
  )
  @UseRoleGuards([Role.ADMIN])
  @Post('material/:m_id')
  create(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Body() body: CreateQuizzesDto,
  ) {
    return this.quizService.create(m_id, body.content);
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クイズ取得',
    'クイズ取得に成功しました。',
    QuizContent,
    true,
  )
  @UseRoleGuards([Role.ADMIN])
  @Get('material/:m_id/recommend-quizzes')
  getQuizzesByLLM(@Param('m_id', BigIntPipe) m_id: bigint) {
    return this.quizService.getQuizzesByLLM(m_id);
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'クイズ修正',
    'クイズ修正に成功しました。',
  )
  @UseRoleGuards([Role.ADMIN])
  @Patch(':q_id')
  update(
    @Param('q_id', BigIntPipe) q_id: bigint,
    @Body() content: UpdateQuizDto,
  ) {
    return this.quizService.update(q_id, content);
  }

  @ApiResponseWithBody(
    HttpStatus.NO_CONTENT,
    'クイズ削除',
    'クイズ削除に成功しました。',
  )
  @UseRoleGuards([Role.ADMIN])
  @Delete(':q_id')
  remove(@Param('q_id', BigIntPipe) q_id: bigint) {
    return this.quizService.remove(q_id);
  }
}
