import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from './entities/likes.entity';
import { User } from 'src/users/entities/user.entity';
import { LikesService } from './likes.service';
import { Post } from '../posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Likes, User, Post])],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
