import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { MediaFile } from './entities/media-file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([MediaFile]), CloudinaryModule],
  providers: [FileUploadService],
  controllers: [FileUploadController],
  exports: [FileUploadService],
})
export class FileUploadModule {}
