import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiAuthenticatedEndpoint } from 'src/common/decorators/api-responses.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginatedResponse } from 'src/common/dto/responses/base-response.dto';
import { SuccessResponseDto } from 'src/common/dto/responses/success-response.dto';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Liked successfully')
  @ApiAuthenticatedEndpoint('Like a post', 200, SuccessResponseDto)
  @Post(':postId')
  likePost(
    @GetUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.likesService.likePost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Unliked successfully')
  @ApiAuthenticatedEndpoint('Unlike a post', 200, SuccessResponseDto)
  @Delete(':postId')
  unlikePost(
    @GetUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.likesService.unlikePost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiAuthenticatedEndpoint(
    'Get liked post for the current user',
    200,
    PaginatedResponse,
  )
  @Get('posts')
  getLikedPosts(
    @GetUser('id') userId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.likesService.getLikedPosts(userId, paginationQueryDto);
  }
}
