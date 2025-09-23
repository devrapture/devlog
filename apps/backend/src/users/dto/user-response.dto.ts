import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { UserRole } from 'src/users/entities/user.entity';

export class UserDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  id: string;

  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    type: String,
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: Boolean,
  })
  isActive: boolean;

  @ApiProperty({
    type: String,
  })
  @IsString()
  avatar: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  bio: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  displayName: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  lastLoginAt: string;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  followingCount: number;

  @ApiProperty({
    type: Number,
  })
  @IsInt()
  followersCount: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  createdAt: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  updatedAt: string;
}

export class UserDataDto {
  @ApiProperty({
    type: UserDto,
  })
  user: UserDto;
}

export class UpdateUserProfileResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: UserDataDto })
  data: UserDataDto;
}

export class UpdateUserProfileByIdResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the request was successful',
  })
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: UserDataDto })
  data: UserDataDto;

  @ApiProperty({
    type: Boolean,
  })
  isFollowing: boolean;
}
