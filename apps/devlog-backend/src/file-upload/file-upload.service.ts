import { Injectable } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile } from './entities/media-file.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(MediaFile)
    private readonly mediaFileRepository: Repository<MediaFile>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadFile(
    uploadFileDto: UploadFileDto,
    file: Express.Multer.File,
    user: User,
  ) {
    const cloudinaryResult = await this.cloudinaryService.uploadFile(file);
    const newCreatedFile = this.mediaFileRepository.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      originalName: file.originalname,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      mimeType: file.mimetype,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      size: file.size,
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      altText: uploadFileDto.altText,
      uploader: user,
    });
    return this.mediaFileRepository.save(newCreatedFile);
  }
}
