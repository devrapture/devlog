import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { User } from 'src/users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async followUser(userId: string, followingId: string) {
    if (userId === followingId) {
      throw new Error('You cannot follow yourself');
    }

    const following = await this.userRepository.findOne({
      where: {
        id: followingId,
      },
    });

    if (!following) throw new NotFoundException('User to follow not found');

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    try {
      await this.followRepository.manager.transaction(async (manager) => {
        await manager
          .createQueryBuilder()
          .insert()
          .into(Follow)
          .values({
            follower: { id: userId },
            following: { id: followingId },
          })
          .execute();

        // Increment follow count
        await manager.increment(User, { id: userId }, 'followingCount', 1);
        await manager.increment(User, { id: followingId }, 'followersCount', 1);
      });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.driverError?.code === '23505'
      ) {
        throw new ConflictException('User is already following');
      }
    }

    return;
  }

  async unfollowUser(userId: string, followingId: string) {
    const following = await this.userRepository.findOne({
      where: {
        id: followingId,
      },
    });

    if (!following) throw new NotFoundException('User to unfollow not found');

    await this.followRepository.manager.transaction(async (manager) => {
      const result = await manager
        .createQueryBuilder()
        .delete()
        .from(Follow)
        .where('followerId = :userId AND followingId = :followingId', {
          userId,
          followingId,
        })
        .execute();

      if (!result.affected) {
        throw new NotFoundException('User is not following this user');
      }

      // Decrement follow count
      await manager.decrement(User, { id: userId }, 'followingCount', 1);
      await manager.decrement(User, { id: followingId }, 'followersCount', 1);
    });

    return;
  }

  async getFollowing(userId: string, paginationQueryDto: PaginationQueryDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    const { limit = 10, page = 1 } = paginationQueryDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.followRepository
      .createQueryBuilder('follow')
      .where('follow.followerId = :userId', {
        userId,
      })
      .leftJoin('follow.following', 'following')
      .addSelect([
        'following.id',
        'following.displayName',
        'following.avatar',
        'following.bio',
        'following.email',
      ])
      .orderBy('follow.createdAt', 'DESC')
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

  async getFollowers(userId: string, paginationQueryDto: PaginationQueryDto) {
    const { limit = 10, page = 1 } = paginationQueryDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.followRepository
      .createQueryBuilder('follow')
      .where('follow.followingId = :userId', { userId })
      .leftJoin('follow.follower', 'follower')
      .addSelect([
        'follower.id',
        'follower.displayName',
        'follower.avatar',
        'follower.bio',
        'follower.email',
      ])
      .orderBy('follow.createdAt', 'DESC')
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
