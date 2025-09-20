import {
  Controller,
  Delete,
  Get,
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
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarkService: BookmarksService) {}

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Bookmarked successfully')
  @ApiAuthenticatedEndpoint('Bookmark a post', 200, SuccessResponseDto)
  @Post(':postId')
  bookmarkPost(
    @GetUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.bookmarkService.bookmarkPost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Unbookmarked successfully')
  @ApiAuthenticatedEndpoint('Unbookmark a post', 200, SuccessResponseDto)
  @Delete(':postId')
  unBookmarkPost(
    @GetUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.bookmarkService.unBookmarkPost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Get bookmarked posts for the current user')
  @ApiAuthenticatedEndpoint(
    'Get bookmarked posts for the current user',
    200,
    PaginatedResponse,
  )
  @Get('posts')
  getBookmarkedPosts(
    @GetUser('id') userId: string,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.bookmarkService.getBookmarkedPosts(userId, paginationQueryDto);
  }
}
