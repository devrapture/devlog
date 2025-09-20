import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '../entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Transform } from 'class-transformer';

export class PostQueryDto extends PaginationQueryDto {
  @ApiProperty({
    required: false,
    type: String,
    description: 'Status of the post',
    enum: PostStatus,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiProperty({
    required: false,
    description: 'Filter by category names',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        // Attempt to parse JSON string (e.g., ["javascript"])
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parsed = JSON.parse(value);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        // If not JSON, treat as a single string and wrap in array
        return [value];
      }
    }
    // If already an array (e.g., from multiple params), return as is
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Array.isArray(value) ? value : [value];
  })
  category?: string[];

  @ApiProperty({
    required: false,
    description: 'Search term for title',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
