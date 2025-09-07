import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UploadFileDto } from './dto/upload-file.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { FileUploadService } from './file-upload.service';
import { FileSizeValidationPipe } from './pipe/file-size-validation.pipe';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth('access-token')
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('File uploaded successfully')
  @Post()
  @ApiOperation({
    summary: 'Upload a file',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // add any extra fields here (title, altText, etc.)
        title: { type: 'string', example: 'Cover image' },
        altText: { type: 'string', example: 'A sunset over the hills' },
        file: { type: 'string', format: 'binary' }, // 👈 the magic line for Swagger "Choose File"
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      example: {
        success: true,
        message: 'File uploaded successfully',
        data: {
          id: 'f8f48153-b872-441a-bebb-7e5cb2572767',
          originalName: 'anakara.jpeg',
          mimeType: 'image/jpeg',
          size: 42826,
          url: 'https://res.cloudinary.com/dgm8zpg94/image/upload/v1757247497/youtube-nestjs-course/mcxxhs3voge4cig7mtyh.jpg',
          publicId: 'youtube-nestjs-course/mcxxhs3voge4cig7mtyh',
          altText: 'Cover image',
          createdAt: '2025-09-07T12:18:17.899Z',
          updatedAt: '2025-09-07T12:18:17.899Z',
          uploader: {
            id: '387869d1-b50e-463c-aef2-3737276d3802',
            role: 'user',
            email: 'test@gmail.com',
            displayName: null,
          },
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // add any extra fields here (title, altText, etc.)
        altText: { type: 'string', example: 'Cover image' },
        file: { type: 'string', format: 'binary' }, // 👈 the magic line for Swagger "Choose File"
      },
      required: ['file'],
    },
  })
  uploadFile(
    @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @GetUser() user: User,
  ) {
    return this.fileUploadService.uploadFile(uploadFileDto, file, user);
  }
}
