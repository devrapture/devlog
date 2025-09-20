import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Follow } from './entities/follow.entity';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow, Post])],
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule {}
