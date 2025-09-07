import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'URL of the user’s avatar image',
    required: false,
    type: String,
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: `User's biography or description`,
    required: false,
    type: String,
    example: 'Software developer with a passion for AI',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: "User's display name",
    required: false,
    type: String,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  displayName?: string;
}
