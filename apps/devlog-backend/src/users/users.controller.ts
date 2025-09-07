import {
  Body,
  Controller,
  HttpStatus,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
}
