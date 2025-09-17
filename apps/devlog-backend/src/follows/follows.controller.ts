import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiAuthenticatedEndpoint } from 'src/common/decorators/api-responses.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { SuccessResponseDto } from 'src/common/dto/responses/success-response.dto';
import { FollowsService } from './follows.service';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('User is following successfully')
  @ApiAuthenticatedEndpoint('Follow User', 200, SuccessResponseDto)
  followUser(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) followingId: string,
  ) {
    return this.followsService.followUser(userId, followingId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiAuthenticatedEndpoint('Unfollow user', 200, SuccessResponseDto)
  unfollowUser(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) followingId: string,
  ) {
    return this.followsService.unfollowUser(userId, followingId);
  }

  @Get('following')
  @UseGuards(JwtAuthGuard)
  @ApiAuthenticatedEndpoint('Get following', 200, SuccessResponseDto)
  getFollowing(@GetUser('id') userId: string) {
    return this.followsService.getFollowing(userId);
  }

  @Get('followers')
  @UseGuards(JwtAuthGuard)
  @ApiAuthenticatedEndpoint('Get followers', 200, SuccessResponseDto)
  getFollowers(@GetUser('id') userId: string) {
    return this.followsService.getFollowers(userId);
  }
}
