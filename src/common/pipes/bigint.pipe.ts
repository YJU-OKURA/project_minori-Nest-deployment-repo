import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class BigIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return BigInt(value);
    } catch (error) {
      throw new BadRequestException(
        'Please provide a valid value for the parameter: ' +
          metadata.data +
          ' (BigInt)',
      );
    }
  }
}
