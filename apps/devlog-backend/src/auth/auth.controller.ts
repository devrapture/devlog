import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ResponseMessage('User account created successfully')
  @ApiOperation({
    summary: 'Sign up a new user',
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        success: true,
        message: 'user account created successfully',
        data: {
          user: {
            id: 'b5c3c099-9035-49c5-8321-6a0c3b1a75ee',
            role: 'user',
            email: 'test1@test.com',
            avatar: null,
            bio: null,
            displayName: null,
            isActive: true,
            lastLoginAt: null,
            createdAt: '2025-09-06T18:30:09.877Z',
            updatedAt: '2025-09-06T18:30:09.877Z',
          },
        },
      },
    },
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }
}
