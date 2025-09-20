import { ApiProperty } from '@nestjs/swagger';
import { CategoryDataDto } from 'src/categories/dto/category-response.dto';
import { AuthorDto } from 'src/common/dto/author.dto';
import { PaginationMetaDto } from 'src/common/dto/responses/base-response.dto';
import { PostStatus } from 'src/posts/entities/post.entity';

export class PublishDataDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;

  @ApiProperty({
    description: 'Content body of the draft post',
    nullable: true,
  })
  body: string;

  @ApiProperty({
    example: PostStatus.PUBLISHED,
  })
  status: PostStatus;

  @ApiProperty({
    description: 'URL of the cover image',
  })
  coverImage: string;

  // category
  @ApiProperty({
    type: [CategoryDataDto],
  })
  categories: string[];

  @ApiProperty()
  slug: string;

  @ApiProperty()
  publishedAt: Date;

  @ApiProperty()
  views: number;

  @ApiProperty()
  likes: number;

  @ApiProperty()
  comments: number;

  @ApiProperty()
  bookmarks: number;

  @ApiProperty({
    type: AuthorDto,
    description: 'Author information',
  })
  author: AuthorDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PublishResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: PublishDataDto })
  data: PublishDataDto;
}

export class PublishResponseDtoWithPagination {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: [PublishDataDto],
    description: 'Response data containing the draft',
  })
  items: PublishDataDto[];

  @ApiProperty({
    type: PaginationMetaDto,
    description: 'Pagination metadata',
  })
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
