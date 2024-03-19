import { ResponseFormat } from '@common/utils/response.util';
import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiDefaultMetadata = (tag: string) => {
  return applyDecorators(
    ApiTags(tag),
    ApiBearerAuth('Authorization'),
    ApiUnauthorizedResponse({
      description: '認証が必要です。',
    }),
    ApiInternalServerErrorResponse({
      description: 'サーバーエラー',
    }),
    ApiExtraModels(ResponseFormat),
  );
};
