import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private readonly maxSizeInBytes: number;

  constructor() {
    // 1 MB = 1024 * 1024 bytes
    this.maxSizeInBytes = 1 * 1024 * 1024;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!value || typeof value.size !== 'number') {
      throw new BadRequestException('No file provided or invalid file size');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (value.size > this.maxSizeInBytes) {
      throw new BadRequestException(
        `File size exceeds the maximum limit of ${this.maxSizeInBytes / (1024 * 1024)} MB`,
      );
    }
    // Allow only image MIME types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (!value.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value; // Return the file object if validation passes
  }
}
