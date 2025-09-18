import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from 'src/common/dto/responses/base-response.dto';

export class FollowDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  avatar: string;
}

export class AllFollowersResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    type: [FollowDto],
  })
  follower: FollowDto[];
}

export class AllFollowingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    type: [FollowDto],
  })
  following: FollowDto[];
}

export class AllFollowersResponseDtoWithPagination {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: [AllFollowersResponseDto],
    description: 'Response data containing the draft',
  })
  items: AllFollowersResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class AllFollowingResponseDtoWithPagination {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: [AllFollowingResponseDto],
    description: 'Response data containing the draft',
  })
  items: AllFollowingResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
