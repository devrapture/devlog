import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiAuthenticatedEndpoint,
  ApiDraftEndpoint,
  ApiUnAuthenticatedEndpoint,
} from 'src/common/decorators/api-responses.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { DraftResponseDtoWithPagination } from './dto/draft-response.dto';
import { PostQueryDto } from './dto/post-query.dto';
import { CreatePublishPostDto, RevertPublishDto } from './dto/publish-post.dto';
import {
  PublishResponseDto,
  PublishResponseDtoWithPagination,
} from './dto/publish-response.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiAuthenticatedEndpoint(
    'Get following posts',
    200,
    PublishResponseDtoWithPagination,
  )
  @Get('feed')
  getFollowingPosts(
    @GetUser('id') userId: string,
    @Query() paginatedQueryDto: PaginationQueryDto,
  ) {
    return this.postsService.getFollowingPosts(userId, paginatedQueryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Draft created successfully')
  @Post('draft')
  @ApiDraftEndpoint('Create a draft post for the authenticated user')
  createDraft(@GetUser() user: User) {
    return this.postsService.createDraft(user);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Draft updated successfully')
  @Patch('draft/:draftId')
  @ApiDraftEndpoint('Update a draft post')
  updateDraft(
    @GetUser('id') userId: string,
    @Param('draftId', ParseUUIDPipe) draftId: string,
    @Body() updateDraftDto: CreatePostDto,
  ) {
    return this.postsService.updateDraft(userId, draftId, updateDraftDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('draft/:draftId')
  @ApiDraftEndpoint('Get a user draft by id')
  getUserDraftById(
    @GetUser('id') userId: string,
    @Param('draftId', ParseUUIDPipe) draftId: string,
  ) {
    return this.postsService.getUserDraftById(userId, draftId);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Post published successfully')
  @Patch('publish/:draftId')
  @ApiAuthenticatedEndpoint(
    'Publish a draft post with updated data',
    200,
    PublishResponseDto,
  )
  publishPost(
    @GetUser('id') userId: string,
    @Body() CreatePublishPostDto: CreatePublishPostDto,
    @Param('draftId', ParseUUIDPipe) draftId: string,
  ) {
    return this.postsService.publishPost(userId, CreatePublishPostDto, draftId);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Post published successfully')
  @Patch('publish-existing/:draftId')
  @ApiAuthenticatedEndpoint(
    'Publish an existing draft post',
    200,
    PublishResponseDto,
  )
  publishExistingPost(
    @GetUser('id') userId: string,
    @Param('draftId', ParseUUIDPipe) draftId: string,
  ) {
    return this.postsService.publishExistingPost(userId, draftId);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Post reverted to draft successfully')
  @Patch('revert/:postId')
  @ApiAuthenticatedEndpoint('Revert a post to draft', 200, RevertPublishDto)
  revertToDraft(
    @GetUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.postsService.revertToDraft(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/:postId')
  @ApiAuthenticatedEndpoint(
    'Get post for the authenticated user by post id',
    HttpStatus.OK,
    PublishResponseDtoWithPagination,
  )
  getCurrentUserPostsByPostId(
    @GetUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.postsService.getCurrentUserPostsById(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiAuthenticatedEndpoint(
    'Get all posts for the authenticated user',
    HttpStatus.OK,
    PublishResponseDtoWithPagination,
  )
  getCurrentUserPosts(
    @GetUser('id') userId: string,
    @Query() postQueryDto: PostQueryDto,
  ) {
    return this.postsService.getCurrentUserPosts(userId, postQueryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('draft')
  @ApiAuthenticatedEndpoint(
    'Get all drafts by authenticated user',
    HttpStatus.OK,
    DraftResponseDtoWithPagination,
  )
  getAllUserDraft(
    @GetUser('id') userId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.postsService.getAllDraft(userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':slug')
  @ApiAuthenticatedEndpoint(
    'Get post for public view by slug',
    200,
    PublishResponseDtoWithPagination,
  )
  getPostsBySlug(@Param('slug') slug: string, @Req() req: Request) {
    const ipAddress = req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'];
    return this.postsService.getPostBySlug(
      slug,
      ipAddress,
      userAgent,
      // @ts-expect-error user is not defined
      req.user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  @ApiAuthenticatedEndpoint('Delete a post', HttpStatus.OK, PublishResponseDto)
  // @ApiAuthenticatedEndpoint('Delete a post', 200,)
  deletePost(
    @GetUser('id') userId: string,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.postsService.deletePost(userId, postId);
  }

  @Get(':authorId')
  @ApiUnAuthenticatedEndpoint(
    'Get all published posts for public view by author',
    200,
    PublishResponseDtoWithPagination,
  )
  getAllPostsByAuthor(
    @Param('authorId', ParseUUIDPipe) authorId: string,
    @Query() paginatedQueryDto: PaginationQueryDto,
  ) {
    return this.postsService.getAllPostsByAuthor(authorId, paginatedQueryDto);
  }

  @Get()
  @ApiUnAuthenticatedEndpoint(
    'Get all published posts for public view',
    200,
    PublishResponseDtoWithPagination,
  )
  getAllPosts(@Query() postQueryDto: PostQueryDto) {
    return this.postsService.getAllPosts(postQueryDto);
  }
}
