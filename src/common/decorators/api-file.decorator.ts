import {
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export function ApiFile(
  schemaObject: Record<
    string,
    SchemaObject | ReferenceObject
  >[] = [],
) {
  const properties = {
    file: {
      type: 'file',
      format: 'binary',
      description: 'PDFのファイルデータ',
    },
  };
  Object.assign(properties, ...schemaObject);
  return applyDecorators(
    UseInterceptors(FileInterceptor('file')),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties,
      },
    }),
  );
}
