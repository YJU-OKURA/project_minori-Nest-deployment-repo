import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { PromptService } from './prompt.service';
import { ApiDefaultMetadata } from '@common/decorators/api-default.decorator';
import { CreatePromptDto } from './dto/create.dto';
import { ApiResponseWithBody } from '@common/decorators/api-response.decorator';
import { UseRoleGuards } from '@common/decorators/use-role-guards.decorator';
import { BigIntPipe } from '@common/pipes/bigint.pipe';
import { User } from '@common/decorators/user.decorator';
import { CreateMessageDto } from './dto/create-message.dto';
import { UseOwnerGuards } from '@common/decorators/use-owner-guards.decorator';
import { ApiParam } from '@nestjs/swagger';
import { PromptEntity } from './entity/prompt.entity';
import { MessageEntity } from './entity/message.entity';
import { Response } from 'express';

@ApiDefaultMetadata('Prompts')
@Controller('prompts')
export class PromptController {
  constructor(
    private readonly promptService: PromptService,
  ) {}

  @ApiResponseWithBody(
    HttpStatus.OK,
    'プロンプトを取得',
    'プロンプトのメッセージの取得に成功しました。',
    PromptEntity,
  )
  @Get('/:id')
  @UseRoleGuards()
  @UseOwnerGuards('Prompt')
  get(
    @Param('id', BigIntPipe) id: bigint,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.promptService.get(id, page, limit);
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    '資料とユーザーのプロンプトを連結',
    '資料とユーザーのプロンプトの連結に成功しました。',
    Number,
  )
  @Post()
  @UseRoleGuards()
  create(
    @User() u_id: bigint,
    @Body() body: CreatePromptDto,
    @Param('c_id', BigIntPipe) c_id: bigint,
  ) {
    return this.promptService.connectToMaterial(
      u_id,
      c_id,
      body.m_id,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.CREATED,
    'プロンプトを利用して質問',
    'プロンプトを利用して質問に成功しました。',
    MessageEntity,
  )
  @Post('/:id')
  @UseRoleGuards()
  @UseOwnerGuards('Prompt')
  async question(
    @Param('id', BigIntPipe) id: bigint,
    @Body() body: CreateMessageDto,
    @Res() response: Response,
  ) {
    await this.promptService.question(
      id,
      body.message,
      response,
    );
    response.end();
  }

  @ApiResponseWithBody(
    HttpStatus.OK,
    '保存されたメッセージを取得',
    '保存されたメッセージを取得に成功しました。',
    MessageEntity,
    true,
  )
  @Get('/:id/messages/saved')
  @UseRoleGuards()
  @UseOwnerGuards('Prompt')
  getSavedMessages(
    @Param('id', BigIntPipe) id: bigint,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return this.promptService.getSavedMessages(
      id,
      page,
      limit,
    );
  }

  @ApiResponseWithBody(
    HttpStatus.NO_CONTENT,
    'プロンプトのメッセージを保存',
    'プロンプトのメッセージを保存に成功しました。',
    String,
  )
  @ApiParam({
    name: 'id',
    description: 'プロンプトID',
  })
  @Patch('/:id/messages/:m_id')
  @UseRoleGuards()
  @UseOwnerGuards('Prompt')
  saveMessage(
    @Param('m_id', BigIntPipe) m_id: bigint,
    @Query('is_save', ParseBoolPipe) is_save: boolean,
  ) {
    return this.promptService.saveMessage(m_id, is_save);
  }
}
