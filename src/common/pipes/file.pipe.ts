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
    const KB = 1024 * 8;
    const size = 300 * KB;

    if (file) {
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Invalid file type');
      }
      if (file.size > size) {
        throw new BadRequestException(
          'File size exceeds limit',
        );
      }
    }
    return file;
  }
}
