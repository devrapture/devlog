import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
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

    const existingFollow = await this.followRepository.findOne({
      where: {
        following: {
          id: followingId,
        },
        follower: {
          id: userId,
        },
      },
    });

    if (existingFollow)
      throw new ConflictException('User is already following');

    await this.followRepository.manager.transaction(async (manager) => {
      // Create follow record
      await manager.save(Follow, {
        follower: { id: userId },
        following: { id: followingId },
      });

      // Increment follow count
      await manager.increment(User, { id: userId }, 'followingCount', 1);
      await manager.increment(User, { id: followingId }, 'followersCount', 1);
    });

    return;
  }

  async unfollowUser(userId: string, followingId: string) {
    const following = await this.userRepository.findOne({
      where: {
        id: followingId,
      },
    });

    if (!following) throw new NotFoundException('User to unfollow not found');

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const existingFollow = await this.followRepository.findOne({
      where: {
        following: {
          id: followingId,
        },
        follower: {
          id: userId,
        },
      },
    });

    if (!existingFollow)
      throw new NotFoundException('User is not following this user');

    await this.followRepository.manager.transaction(async (manager) => {
      // Remove follow record
      await manager.remove(Follow, existingFollow);

      // Decrement follow count
      await manager.decrement(User, { id: userId }, 'followingCount', 1);
      await manager.decrement(User, { id: followingId }, 'followersCount', 1);
    });
    return;
  }

  getFollowing(userId: string) {
    return userId;
  }

  getFollowers(userId: string) {
    return userId;
  }
}
