import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Bookmarks } from './entities/bookmark.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmarks)
    private readonly bookmarkRepository: Repository<Bookmarks>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async bookmarkPost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('Post not found');
    try {
      await this.postRepository.manager.transaction(async (manager) => {
        await manager.save(Bookmarks, {
          user: {
            id: userId,
          },
          post: {
            id: postId,
          },
        });

        await manager.increment(
          Post,
          {
            id: postId,
          },
          'bookmarkCount',
          1,
        );
      });
    } catch (error: unknown) {
      // @ts-expect-error error is unknown
      if (error?.code === '23505') {
        throw new ConflictException('Bookmark already exists');
      }
      throw error;
    }
    return;
  }

  async unBookmarkPost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    const existingBookmark = await this.bookmarkRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        post: {
          id: postId,
        },
      },
    });

    if (!existingBookmark) throw new NotFoundException('Bookmark not found');

    try {
      await this.postRepository.manager.transaction(async (manager) => {
        await manager.remove(Bookmarks, existingBookmark);
        await manager.decrement(
          Post,
          {
            id: postId,
          },
          'bookmarkCount',
          1,
        );
      });
    } catch (error: unknown) {
      // @ts-expect-error error is unknown
      if (error?.code === '23505') {
        throw new ConflictException('Bookmark already exists');
      }
      throw error;
    }

    return;
  }

  async getBookmarkedPosts(
    userId: string,
    paginationQueryDto: PaginationQueryDto,
  ) {
    const { page = 1, limit = 10 } = paginationQueryDto;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const skip = (page - 1) * limit;
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.bookmarks', 'bookmarks', 'bookmarks.userId = :userId', {
        userId,
      })
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
