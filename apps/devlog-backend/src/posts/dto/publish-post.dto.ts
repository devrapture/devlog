import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsUUID, IsNotEmpty } from 'class-validator';
import { DraftDataDto } from './draft-response.dto';

export class CreatePublishPostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'My First Post',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content of the post',
    example: 'Hello, world!',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    description: 'Array of category IDs',
    required: true,
    type: [String],
    example: ['c1d2e3f4-5678-9012-3456-7890abcdef12'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsUUID('all', { each: true })
  categories: string[];

  @ApiProperty({
    description: 'Cover image URL',
    example: 'https://example.com/cover-image.jpg',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  coverImage: string;
}

export class RevertPublishDto extends DraftDataDto {}
