import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreatePublishPostDto, RevertPublishDto } from './dto/publish-post.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import {
  ApiAuthenticatedEndpoint,
  ApiDraftEndpoint,
  ApiUnAuthenticatedEndpoint,
} from 'src/common/decorators/api-responses.decorator';
import { DraftResponseDtoWithPagination } from './dto/draft-response.dto';
import {
  PublishResponseDto,
  PublishResponseDtoWithPagination,
} from './dto/publish-response.dto';
import { PostQueryDto } from './dto/post-query.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Draft created successfully')
  @Post('draft')
  @ApiDraftEndpoint('Create a draft post for the authenticated user')
  createDraft(@GetUser() user: User) {
    return this.postsService.createDraft(user);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Draft updated successfully')
  @Patch('draft/:id')
  @ApiDraftEndpoint('Update a draft post')
  updateDraft(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDraftDto: CreatePostDto,
  ) {
    return this.postsService.updateDraft(userId, id, updateDraftDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
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
  @Get('draft/:id')
  @ApiDraftEndpoint('Get a user draft by id')
  getUserDraftById(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.postsService.getUserDraftById(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Post published successfully')
  @Patch('publish/:id')
  @ApiAuthenticatedEndpoint(
    'Publish a draft post with updated data',
    200,
    PublishResponseDto,
  )
  publishPost(
    @GetUser('id') userId: string,
    @Body() CreatePublishPostDto: CreatePublishPostDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.postsService.publishPost(userId, CreatePublishPostDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ResponseMessage('Post published successfully')
  @Patch('publish-existing/:id')
  @ApiAuthenticatedEndpoint(
    'Publish an existing draft post',
    200,
    PublishResponseDto,
  )
  publishExistingPost(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.postsService.publishExistingPost(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Post reverted to draft successfully')
  @Patch('revert/:id')
  @ApiAuthenticatedEndpoint('Revert a post to draft', 200, RevertPublishDto)
  revertToDraft(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.postsService.revertToDraft(userId, id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all published posts for public view',
  })
  @ApiUnAuthenticatedEndpoint(
    'Get all published posts for public view',
    200,
    PublishResponseDtoWithPagination,
  )
  getAllPosts(@Query() postQueryDto: PostQueryDto) {
    return this.postsService.getAllPosts(postQueryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiUnAuthenticatedEndpoint(
    'Get all posts for the authenticated user',
    200,
    PublishResponseDtoWithPagination,
  )
  getCurrentUserPosts(
    @GetUser('id') userId: string,
    @Query() postQueryDto: PostQueryDto,
  ) {
    return this.postsService.getCurrentUserPosts(userId, postQueryDto);
  }
}
