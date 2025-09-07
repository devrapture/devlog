import {
  Body,
  Controller,
  HttpStatus,
  HttpCode,
  Patch,
  UseGuards,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('User updated successfully')
  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a user profile',
  })
  @ApiResponse({
    status: 201,
    description: 'User updated successfully',
    schema: {
      example: {
        success: true,
        message: 'User updated successfully',
        data: {
          user: {
            id: '387869d1-b50e-463c-aef2-3737276d3802',
            role: 'user',
            email: 'test@gmail.com',
            avatar: 'https://example.com/avatar.jpg',
            bio: 'Software developer with a passion for AI',
            displayName: 'John Doe',
            isActive: true,
            lastLoginAt: '2025-09-07T14:17:39.124Z',
            createdAt: '2025-09-07T00:53:43.264Z',
            updatedAt: '2025-09-07T14:18:15.467Z',
          },
        },
      },
    },
  })
  updateUser(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get a user profile',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        message: 'OK',
        data: {
          user: {
            id: '387869d1-b50e-463c-aef2-3737276d3802',
            role: 'user',
            email: 'test@gmail.com',
            avatar:
              'https://res.cloudinary.com/dgm8zpg94/image/upload/v1757247497/youtube-nestjs-course/mcxxhs3voge4cig7mtyh.jpg',
            bio: 'Software developer with a passion for AI',
            displayName: 'John Doe',
            isActive: true,
            lastLoginAt: '2025-09-07T14:17:39.124Z',
            createdAt: '2025-09-07T00:53:43.264Z',
            updatedAt: '2025-09-07T14:21:42.832Z',
          },
        },
      },
    },
  })
  getUserProfile(@GetUser('id') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @ApiOperation({
    summary: 'Get a user profile by ID',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        message: 'OK',
        data: {
          user: {
            id: '387869d1-b50e-463c-aef2-3737276d3802',
            role: 'user',
            email: 'test@gmail.com',
            avatar:
              'https://res.cloudinary.com/dgm8zpg94/image/upload/v1757247497/youtube-nestjs-course/mcxxhs3voge4cig7mtyh.jpg',
            bio: 'Software developer with a passion for AI',
            displayName: 'John Doe',
            isActive: true,
            lastLoginAt: '2025-09-07T14:17:39.124Z',
            createdAt: '2025-09-07T00:53:43.264Z',
            updatedAt: '2025-09-07T14:21:42.832Z',
          },
        },
      },
    },
  })
  @Get(':id')
  getUserProfileById(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.getUserProfile(userId);
  }
}
