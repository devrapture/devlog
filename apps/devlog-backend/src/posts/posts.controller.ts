import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { GetUser } from 'src/auth/decorator/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ResponseMessage('Draft created successfully')
  @Post('draft')
  @ApiOperation({
    summary: 'Create a draft post',
  })
  @ApiResponse({
    status: 401,
    description: 'Draft created successfully',
    schema: {
      example: {
        success: true,
        message: 'Draft created successfully',
        data: {
          draft: {
            id: 'd313682f-0dc8-4938-b677-ae89fa7a0ed0',
            title: 'Untitled Draft',
            body: null,
            status: 'draft',
            coverImage: null,
            slug: null,
            publishedAt: null,
            views: 0,
            likes: 0,
            comments: 0,
            bookmarks: 0,
            author: {
              id: '387869d1-b50e-463c-aef2-3737276d3802',
              role: 'user',
              email: 'test@gmail.com',
              displayName: 'John Doe',
            },
            createdAt: '2025-09-07T21:15:47.166Z',
            updatedAt: '2025-09-07T21:15:47.166Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  createDraft(@GetUser() user: User) {
    return this.postsService.createDraft(user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ResponseMessage('Draft updated successfully')
  @Patch('draft/:id')
  @ApiOperation({
    summary: 'Update a draft post',
  })
  updateDraft(
    @GetUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDraftDto: CreatePostDto,
  ) {
    return this.postsService.updateDraft(userId, id, updateDraftDto);
  }
}
