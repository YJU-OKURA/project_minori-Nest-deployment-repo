import { ResponseFormat } from '@common/utils/response.util';
import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  getSchemaPath,
  ApiResponseOptions,
  ApiResponse,
  ApiOperation,
  ApiOperationOptions,
} from '@nestjs/swagger';

export function ApiResponseWithBody<T>(
  operationOptions: ApiOperationOptions,
  options: ApiResponseOptions,
  type: Type<T>,
  isArray: boolean = false,
): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiExtraModels(type)(target, propertyKey, descriptor);
    const isPrimitive = [String, Boolean, Number].includes(
      type as any,
    );
    options.content = {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ResponseFormat) },
            {
              properties: {
                response: {
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
    };
    return applyDecorators(
      ApiOperation(operationOptions),
      ApiResponse(options),
    )(target, propertyKey, descriptor);
  };
}
