import { ResponseFormat } from '@common/utils/response.util';
import {
  HttpCode,
  HttpStatus,
  Type,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiExtraModels,
  getSchemaPath,
  ApiResponseOptions,
  ApiResponse,
  ApiOperation,
  ApiOperationOptions,
} from '@nestjs/swagger';

export function ApiResponseWithBody(
  status: HttpStatus,
  summary: string,
  description: string,
  type: Type = Object,
  isArray: boolean = false,
): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const operationOptions: ApiOperationOptions = {
      summary,
    };
    if (status === HttpStatus.NO_CONTENT) {
      return applyDecorators(
        ApiOperation(operationOptions),
        ApiResponse({
          status,
          description,
        }),
        HttpCode(status),
      )(target, propertyKey, descriptor);
    }
    ApiExtraModels(type)(target, propertyKey, descriptor);
    const isPrimitive = [String, Boolean, Number].includes(
      type as any,
    );
    const options: ApiResponseOptions = {
      status,
      description,
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ResponseFormat) },
              {
                properties: {
                  data: {
                    type: isPrimitive
                      ? type.name.toLowerCase()
                      : isArray
                      ? 'array'
                      : 'object',
                    items:
                      isArray && !isPrimitive
                        ? { $ref: getSchemaPath(type) }
                        : undefined,
                    $ref:
                      !isArray && !isPrimitive
                        ? getSchemaPath(type)
                        : undefined,
                  },
                },
              },
            ],
          },
        },
      },
    };
    return applyDecorators(
      ApiOperation(operationOptions),
      ApiResponse(options),
      HttpCode(status),
    )(target, propertyKey, descriptor);
  };
}
