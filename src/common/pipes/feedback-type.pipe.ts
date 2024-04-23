import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

export enum FeedbackType {
  ALL = 'all',
  PART = 'part',
}

@Injectable()
export class FeedbackTypePipe
  implements PipeTransform<string, FeedbackType>
{
  transform(
    value: string,
    metadata: ArgumentMetadata,
  ): FeedbackType {
    if (!value) {
      throw new BadRequestException(
        'Feedback type is required.',
      );
    }
    if (
      !Object.values(FeedbackType).includes(value as any)
    ) {
      throw new BadRequestException(
        `'${value}' is an invalid feedback type. Valid feedback types are ${Object.values(
          FeedbackType,
        )}`,
      );
    }
    return value as FeedbackType;
  }
}
