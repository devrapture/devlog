import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { PostView } from './entities/post-view.entity';

@Injectable()
export class ViewTrackerService {
  constructor(
    @InjectRepository(PostView)
    private viewRepository: Repository<PostView>,
  ) {}

  async trackUniqueView(
    postId: string,
    ipAddress: string,
    userId?: string,
    userAgent?: string,
  ): Promise<boolean> {
    const timeWindow = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24-hour window

    const existingView = await this.viewRepository.findOne({
      where: {
        post: {
          id: postId,
        },
        ipAddress,
        createdAt: MoreThan(timeWindow),
        ...(userId && { userId }), // Include userId if provided
      },
    });

    if (existingView) return false;

    await this.viewRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const newView = transactionalEntityManager.create(PostView, {
          postId,
          ipAddress,
          userAgent,
          userId,
        });
        await transactionalEntityManager.save(newView);
      },
    );

    return true;
  }
}
