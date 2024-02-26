import { ApiProperty } from '@nestjs/swagger';

export class ResponseFormat<T> {
  @ApiProperty({
    example: 200,
    description: 'The status code of the response.',
  })
  statusCode: number;

  @ApiProperty({
    description: 'The actual response data.',
  })
  response: T;
}

export const responseFormat = (
  statusCode: number,
  res: any,
): ResponseFormat<any> => ({
  statusCode,
  response: res,
});
