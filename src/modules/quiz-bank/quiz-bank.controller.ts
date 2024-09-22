import { ApiDefaultMetadata } from '@common/decorators/api-default.decorator';
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
import { QuizBankService } from './quiz-bank.service';
import { ApiResponseWithBody } from '@common/decorators/api-response.decorator';
import { BigIntPipe } from '@common/pipes/bigint.pipe';
import { UseOwnerGuards } from '@common/decorators/use-owner-guards.decorator';
import { Prisma, Role } from '@prisma/client';
import { User } from '@common/decorators/user.decorator';
import { UpdateQuizDto as CreateUpdateQuizBankDto } from '@modules/quiz/dto/create-update.dto';
import { QuizEntity as QuizBankEntity } from '@modules/quiz/entity/quiz.entity';
import { UseRoleGuards } from '@common/decorators/use-role-guards.decorator';
import { CreateQuizBankDto } from './dto/create.dto';

@ApiDefaultMetadata('QuizBanks')
@Controller('api/nest/quiz-banks')
export class QuizBankController {
  constructor(
    private readonly quizBankService: QuizBankService,
  ) {}

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クイズバンク検索',
    'クイズバンク検索に成功しました。',
    QuizBankEntity,
    true,
  )
  @Get('search')
  search(
    @User() u_id: bigint,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('keyword') keyword: string,
  ) {
    return this.quizBankService.search(
      u_id,
      page,
      limit,
      keyword,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クイズバンク取得',
    'クイズバンク取得に成功しました。',
    QuizBankEntity,
  )
  @UseOwnerGuards(Prisma.ModelName.QuizBank)
  @Get(':id')
  get(@Param('id', BigIntPipe) id: bigint) {
    return this.quizBankService.get(id);
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    'クイズバンク一覧取得',
    'クイズバンク一覧取得に成功しました。',
    QuizBankEntity,
    true,
  )
  @Get()
  getMany(
    @User() u_id: bigint,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.quizBankService.getMany(u_id, page, limit);
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'クイズバンク作成',
    'クイズバンク作成に成功しました。',
    String,
  )
  @UseRoleGuards([Role.ADMIN])
  @Post()
  create(
    @User() u_id: bigint,
    @Param('c_id', BigIntPipe) c_id: bigint,
    @Body() body: CreateQuizBankDto,
  ) {
    return this.quizBankService.create(
      c_id,
      u_id,
      body.q_id,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'クイズバンク更新',
    'クイズバンク更新に成功しました。',
    String,
  )
  @UseOwnerGuards(Prisma.ModelName.QuizBank)
  @Patch(':id')
  update(
    @Param('id', BigIntPipe) id: bigint,
    @Body() body: CreateUpdateQuizBankDto,
  ) {
    return this.quizBankService.update(id, body.content);
  }

  @ApiResponseWithBody(
    HttpStatus.NO_CONTENT,
    'クイズバンク削除',
    'クイズバンク削除に成功しました。',
    String,
  )
  @UseOwnerGuards(Prisma.ModelName.QuizBank)
  @Delete(':id')
  remove(@Param('id', BigIntPipe) id: bigint) {
    return this.quizBankService.remove(id);
  }
}
