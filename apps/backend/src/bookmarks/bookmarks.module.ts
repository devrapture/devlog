import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { Bookmarks } from './entities/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmarks, User, Post])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}
