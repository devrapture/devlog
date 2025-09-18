import { ApiProperty } from '@nestjs/swagger';

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
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
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
  meta: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
