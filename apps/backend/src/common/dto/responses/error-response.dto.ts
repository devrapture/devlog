import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
  })
  message: string;
}
