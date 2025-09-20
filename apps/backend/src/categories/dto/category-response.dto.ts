import { ApiProperty } from '@nestjs/swagger';

export class CategoryDataDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class CategoryResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: [CategoryDataDto],
    description: 'Response data containing the categories',
  })
  data: CategoryDataDto[];
}
