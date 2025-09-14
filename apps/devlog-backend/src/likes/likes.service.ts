import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from './entities/likes.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async likePost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.likesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        post: {
          id: postId,
        },
      },
    });

    if (existingLike) throw new ConflictException('Like already exists');

    await this.postRepository.manager.transaction(async (manager) => {
      // Create like record
      await manager.save(Likes, {
        user: { id: userId },
        post: { id: postId },
      });
      // Increment like count
      await manager.increment(Post, { id: postId }, 'likesCount', 1);
    });

    return;
  }

  async unlikePost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.likesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        post: {
          id: postId,
        },
      },
    });

    if (!existingLike) throw new NotFoundException('This post is not liked');

    await this.postRepository.manager.transaction(async (manager) => {
      //  removes the like record
      await manager.remove(Likes, existingLike);
      // Decrement like count
      await manager.decrement(
        Post,
        {
          id: postId,
        },
        'likesCount',
        1,
      );
    });

    return;
  }

  async getLikedPosts(userId: string, paginationQueryDto: PaginationQueryDto) {
    const { limit = 10, page = 1 } = paginationQueryDto;
    const skip = (page - 1) * limit;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.likes', 'likes', 'likes.userId = :userId', { userId })
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.displayName', 'author.avatar'])
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);
    const [items, totalItems] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    const res = {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
    return res;
  }
}
