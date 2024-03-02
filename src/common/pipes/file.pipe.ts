import {
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(
    private readonly isFileRequired: boolean = true,
  ) {}

  transform(file: Express.Multer.File) {
    if (this.isFileRequired && !file) {
      throw new BadRequestException('File is required');
    }

    if (file) {
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Invalid file type');
      }
      const MB = 1024 * 1024 * 8;
      const size = 10 * MB;
      if (file.size > size) {
        throw new BadRequestException(
          'File size exceeds limit (10MB)',
        );
      }
    }
    return file;
  }
}
