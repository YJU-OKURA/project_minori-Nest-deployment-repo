import { ApiProperty } from '@nestjs/swagger';

export class ResponseFormat {
  @ApiProperty({
    example: 200,
    description: 'The status code of the response.',
  })
  statusCode: number;

  @ApiProperty({
    description: 'The actual response data.',
  })
  data: any;
}

export const responseFormat = (
  statusCode: number,
  res: any,
): ResponseFormat => ({
  statusCode,
  data: res,
});
