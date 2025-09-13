import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Category } from '../categories/entities/category.entity';
import { User } from '../users/entities/user.entity';
import { ViewTrackerService } from './view-tracker.service';
import { PostView } from './entities/post-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category, User, PostView])],
  providers: [PostsService, ViewTrackerService],
  controllers: [PostsController],
})
export class PostsModule {}
