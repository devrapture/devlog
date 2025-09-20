import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'My First Post',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Content of the post',
    example: 'Hello, world!',
    required: false,
  })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({
    description: 'Array of category IDs',
    required: false,
    type: [String],
    example: ['c1d2e3f4-5678-9012-3456-7890abcdef12'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  categories?: string[];

  @ApiProperty({
    description: 'Cover image URL',
    example: 'https://example.com/cover-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  coverImage?: string;
}
