import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiAuthenticatedEndpoint } from 'src/common/decorators/api-responses.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileByIdResponseDto, UpdateUserProfileResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('User updated successfully')
  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiAuthenticatedEndpoint(
    'Update a user profile',
    200,
    UpdateUserProfileResponseDto,
  )
  updateUser(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiAuthenticatedEndpoint(
    'Get a user profile',
    200,
    UpdateUserProfileResponseDto,
  )
  getUserProfile(@GetUser('id') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @ApiAuthenticatedEndpoint(
    'Get a user profile by ID',
    200,
    UpdateUserProfileByIdResponseDto,
  )
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserProfileById(
    @GetUser('id') currentUserId: string,
    @Param('id', ParseUUIDPipe) userId: string,
  ) {
    return this.userService.getUserProfile(userId, currentUserId);
  }
}
