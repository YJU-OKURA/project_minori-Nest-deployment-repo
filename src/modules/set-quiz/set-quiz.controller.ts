import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponseWithBody } from '@common/decorators/api-response.decorator';
import { UseRoleGuards } from '@common/decorators/use-role-guards.decorator';
import { Prisma, Role } from '@prisma/client';
import { SetQuizService } from './set-quiz.service';
import { CreateSetQuizDto } from './dto/create.dto';
import { ApiDefaultMetadata } from '@common/decorators/api-default.decorator';
import { BigIntPipe } from '@common/pipes/bigint.pipe';
import { User } from '@common/decorators/user.decorator';
import { UseRoleOrOwnerGuards } from '@common/decorators/use-role-or-owner-guards.decorator';
import { UpdateSetQuizDto } from './dto/update.dto';
import { QuizEntity } from '@modules/quiz/entity/quiz.entity';
import { MarkSetQuizDto } from './dto/mark.dto';
import { UseOwnerGuards } from '@common/decorators/use-owner-guards.decorator';
import { QuizResultEntity } from './entity/quiz-result.entity';
import { StatisticsUsersEntity } from './entity/statistics-users.entity';
import { StatisticsClassEntity } from './entity/statistics-class.entity';

@ApiDefaultMetadata('setQuizzes')
@Controller('material/:m_id/set-quiz')
export class SetQuizController {
  constructor(
    private readonly setQuizService: SetQuizService,
  ) {}

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クイズのセット取得',
    'クイズのセット取得に成功しました。',
    QuizEntity,
    true,
  )
  @UseRoleGuards()
  @Get('get')
  get(@Param('m_id', BigIntPipe) m_id: bigint) {
    return this.setQuizService.get(m_id);
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'クイズ採点',
    'クイズ採点に成功しました。',
    String,
  )
  @UseRoleGuards()
  @Post('mark')
  mark(
    @User() u_id: bigint,
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Body() body: MarkSetQuizDto,
  ) {
    return this.setQuizService.mark(
      c_id,
      u_id,
      m_id,
      body.created_at,
      body.quizResults,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'ユーザーのニックネームでクイズの結果取得',
    'ユーザーのニックネームでクイズの結果取得に成功しました。',
    QuizResultEntity,
  )
  @UseRoleGuards([Role.ADMIN])
  @Get('search')
  getResultByNickname(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Query('nickname') nickname: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.setQuizService.getResultByNickname(
      c_id,
      m_id,
      nickname,
      page,
      limit,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'クイズ掲示',
    'クイズ掲示に成功しました。',
    String,
  )
  @UseRoleGuards([Role.ADMIN])
  @Post('post')
  post(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Body() body: CreateSetQuizDto,
  ) {
    return this.setQuizService.post(
      m_id,
      body.deadline,
      body.setQuizData,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'クイズ掲示修正',
    'クイズ掲示修正に成功しました。',
    String,
  )
  @UseRoleGuards([Role.ADMIN])
  @Patch('post')
  updatePost(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Body() body: UpdateSetQuizDto,
  ) {
    return this.setQuizService.updatePost(
      m_id,
      body.deadline,
      body.setQuizData,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'ユーザーのクイズの結果取得',
    'ユーザーのクイズの結果取得に成功しました。',
    QuizResultEntity,
  )
  @UseRoleOrOwnerGuards(
    [Role.ADMIN],
    Prisma.ModelName.ClassUserQuiz,
  )
  @Get('result/user/:u_id')
  getResult(
    @Param('u_id', BigIntPipe) u_id: bigint,
    @Param('m_id', BigIntPipe) m_id: bigint,
  ) {
    return this.setQuizService.getResultByUId(u_id, m_id);
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クラスユーザーたちのクイズ統計',
    'クラスユーザーたちのクイズ統計取得に成功しました。',
    StatisticsUsersEntity,
    true,
  )
  @UseRoleGuards([Role.ADMIN])
  @Get('statistics/users')
  getStatisticsUsers(
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.setQuizService.getStatisticsUsers(
      c_id,
      m_id,
      page,
      limit,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クラスのクイズ統計',
    'クラスのクイズ統計取得に成功しました。',
    StatisticsClassEntity,
  )
  @UseRoleGuards([Role.ADMIN])
  @Get('statistics/class')
  getStatisticsClass(
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Param('m_id', BigIntPipe) m_id: bigint,
  ) {
    return this.setQuizService.getStatisticsClass(
      c_id,
      m_id,
    );
  }
}
