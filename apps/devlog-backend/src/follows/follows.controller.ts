import { Controller, Delete, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FollowsService } from './follows.service';
import { ApiAuthenticatedEndpoint } from 'src/common/decorators/api-responses.decorator';
import { SuccessResponseDto } from 'src/common/dto/responses/success-response.dto';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService:FollowsService){}

  @Post(":id")
  @UseGuards(JwtAuthGuard)
  @ApiAuthenticatedEndpoint('Follow User',200,SuccessResponseDto)
  followUser(@GetUser('id') userId, @Param('id', ParseUUIDPipe) followingId:string){
    return this.followsService.followUser(userId,followingId)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiAuthenticatedEndpoint('Unfollow user',200,SuccessResponseDto)
  unfollowUser(@GetUser('id') userId, @Param('id', ParseUUIDPipe) followingId:string){
return this.followsService.unfollowUser(userId,followingId)
  }
}
