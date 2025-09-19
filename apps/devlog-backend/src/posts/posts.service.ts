import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { generateSlug } from 'src/common/utils/slug.util';
import { Follow } from 'src/follows/entities/follow.entity';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostQueryDto } from './dto/post-query.dto';
import { CreatePublishPostDto } from './dto/publish-post.dto';
import { Post, PostStatus } from './entities/post.entity';
import { ViewTrackerService } from './view-tracker.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly viewTrackerService: ViewTrackerService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followReposity: Repository<Follow>,
  ) { }

  async createDraft(user: User) {
    const draft = this.postRepository.create({
      title: 'Untitled Draft',
      author: user,
    });

    const savedDraft = await this.postRepository.save(draft);
    return {
      draft: savedDraft,
    };
  }

  async updateDraft(
    userId: string,
    postId: string,
    updateDraftDto: CreatePostDto,
  ) {
    const existingDraft = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: ['author', 'categories'],
      select: {
        author: {
          id: true,
          displayName: true,
          avatar: true,
        },
      },
    });

    if (!existingDraft) throw new NotFoundException('Draft not found');

    if (existingDraft?.author?.id !== userId)
      throw new UnauthorizedException('Not authorized to update this draft');

    if (existingDraft.status !== PostStatus.DRAFT)
      throw new BadRequestException('Draft is already published');
    let categoriesToSet: string[] | Category[] | undefined =
      updateDraftDto.categories;
    if (updateDraftDto.categories?.length) {
      categoriesToSet = await this.categoryRepository.find({
        where: {
          id: In(updateDraftDto.categories),
        },
      });

      if (categoriesToSet.length !== updateDraftDto.categories.length)
        throw new NotFoundException('One or more categories not found');
    }

    // Update only provided fields
    const updateFields: Partial<Post> = {};
    for (const key in updateDraftDto) {
      if (updateDraftDto[key] !== undefined && key !== 'categories') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        updateFields[key] = updateDraftDto[key];
      }
    }

    // Apply updates to the existing draft
    Object.assign(existingDraft, updateFields);

    // Explicitly set categories if provided
    if (categoriesToSet !== undefined) {
      existingDraft.categories = categoriesToSet as Category[];
    }

    const savedDraft = await this.postRepository.save(existingDraft);

    return {
      draft: savedDraft,
    };
  }

  async getAllDraft(userId: string, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;

    const skip = (page - 1) * limit;
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'category')
      .andWhere('post.authorId = :userId', { userId })
      .andWhere('post.status = :status', { status: PostStatus.DRAFT })
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

  async getUserDraftById(userId: string, draftId: string) {
    const userDraft = await this.postRepository.findOne({
      where: {
        id: draftId,
        author: {
          id: userId,
        },
        status: PostStatus.DRAFT,
      },
    });
    if (!userDraft) {
      throw new NotFoundException('Draft not found');
    }
    return {
      draft: userDraft,
    };
  }

  async publishPost(
    userId,
    CreatePublishPostDto: CreatePublishPostDto,
    draftId: string,
  ) {
    const existingDraft = await this.postRepository.findOne({
      where: {
        id: draftId,
      },
      relations: ['author', 'categories'],
      select: {
        author: {
          id: true,
          displayName: true,
          avatar: true,
        },
      },
    });

    if (!existingDraft) throw new NotFoundException('Draft not found');

    if (existingDraft?.author?.id !== userId)
      throw new UnauthorizedException('Not authorized to update this draft');

    let categoriesToSet: string[] | Category[] | undefined =
      CreatePublishPostDto.categories;
    if (CreatePublishPostDto.categories?.length) {
      categoriesToSet = await this.categoryRepository.find({
        where: {
          id: In(CreatePublishPostDto.categories),
        },
      });

      if (categoriesToSet.length !== CreatePublishPostDto.categories.length)
        throw new NotFoundException('One or more categories not found');
    }

    existingDraft.categories = categoriesToSet as Category[];
    existingDraft.slug = generateSlug(CreatePublishPostDto.title);
    existingDraft.status = PostStatus.PUBLISHED;
    existingDraft.publishedAt = new Date();

    return await this.postRepository.save(existingDraft);
  }

  async publishExistingPost(userId: string, draftId: string) {
    const existingDraft = await this.postRepository.findOne({
      where: {
        id: draftId,
      },
      relations: ['author', 'categories'],
      select: {
        author: {
          id: true,
          displayName: true,
          avatar: true,
        },
      },
    });

    if (!existingDraft) throw new NotFoundException('Draft not found');

    if (existingDraft?.author?.id !== userId)
      throw new UnauthorizedException('Not authorized to update this draft');

    if (
      !existingDraft.title ||
      !existingDraft.body ||
      !existingDraft.coverImage ||
      !existingDraft.categories.length
    )
      throw new BadRequestException('Missing required fields');

    if (!existingDraft.slug) {
      existingDraft.slug = generateSlug(existingDraft.title);
    }
    existingDraft.status = PostStatus.PUBLISHED;
    existingDraft.publishedAt = new Date();

    return await this.postRepository.save(existingDraft);
  }

  async revertToDraft(userId: string, draftId: string) {
    const existingDraft = await this.postRepository.findOne({
      where: {
        id: draftId,
      },
      relations: ['author', 'categories'],
      select: {
        author: {
          id: true,
          displayName: true,
          avatar: true,
        },
      },
    });

    if (!existingDraft) throw new NotFoundException('Draft not found');

    if (existingDraft?.author?.id !== userId)
      throw new UnauthorizedException('Not authorized to update this draft');

    if (existingDraft.status === PostStatus.DRAFT)
      throw new BadRequestException('Draft is already published');

    existingDraft.status = PostStatus.DRAFT;

    return await this.postRepository.save(existingDraft);
  }

  async getAllPosts(postQueryDto: PostQueryDto) {
    const { page = 1, limit = 10, category, search } = postQueryDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.displayName', 'author.avatar'])
      .orderBy('post.createdAt', 'DESC')
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .limit(limit)
      .skip(skip);

    if (category && category.length > 0) {
      queryBuilder.andWhere('LOWER(categories.name) IN (:...categories)', {
        categories: category,
      });
    }

    if (search) {
      queryBuilder.andWhere('LOWER(post.title) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

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

  async getCurrentUserPosts(userId: string, postQueryDto: PostQueryDto) {
    const { page = 1, limit = 10, category, search, status } = postQueryDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoin('post.author', 'author')
      .andWhere('post.authorId = :userId', { userId })
      .addSelect(['author.id', 'author.displayName', 'author.avatar'])
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (category && category.length > 0) {
      queryBuilder.andWhere('LOWER(categories.name) IN (:...categories)', {
        categories: category,
      });
    }

    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere('LOWER(post.title) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

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

  async getCurrentUserPostsById(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        author: {
          id: userId,
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      post,
    };
  }

  async getAllPostsByAuthor(
    _authorId: string,
    paginatedQueryDto: PaginationQueryDto,
  ) {
    const authorId = await this.userRepository.findOne({
      where: {
        id: _authorId,
      },
    });

    if (!authorId) {
      throw new NotFoundException('Author not found');
    }

    const { page = 1, limit = 10 } = paginatedQueryDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .andWhere('post.authorId = :_authorId', { _authorId })
      .addSelect(['author.id', 'author.displayName', 'author.avatar'])
      .skip(skip)
      .limit(limit);

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

  async getPostBySlug(
    slug: string,
    ipAddress: string,
    userAgent?: string,
    user?: User,
  ) {
    console.log('ipAddress', ipAddress);
    console.log('userAgent', userAgent);
    console.log('userId', user);
    const post = await this.postRepository.findOne({
      where: {
        slug,
      },
      relations: ['author', 'categories'],
      select: {
        author: {
          id: true,
          displayName: true,
          avatar: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // TODO: fix unique view tracking
    const isUniqueView = await this.viewTrackerService.trackUniqueView(
      post.id,
      ipAddress,
      user?.id, // Pass userId if authenticated
      userAgent,
    );

    if (isUniqueView) {
      await this.postRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.increment(
            Post,
            { id: post.id },
            'views',
            1,
          );
          post.views += 1; // Update the in-memory post object
        },
      );
    }

    return {
      post,
    };
  }

  async deletePost(userId: string, postId: string) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        author: {
          id: userId,
        },
      },
      relations: ['author'],
      select: {
        author: {
          id: true,
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id !== userId)
      throw new UnauthorizedException('Not authorized to delete this post');

    await this.postRepository.delete(post.id);

    return {
      post,
    };
  }

  async getFollowingPosts(
    userId: string,
    paginatedQueryDto: PaginationQueryDto,
  ) {
    const { limit = 10, page = 1 } = paginatedQueryDto;
    const skip = (page - 1) * limit;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const follow = await this.followReposity.find({
      where: {
        follower: {
          id: userId,
        },
      },
      relations: ['following'],
    });

    const followingUserIds = follow?.map((user) => user?.following?.id);

    if (!followingUserIds?.length) {
      return {
        items: [],
        meta: {
          currentPage: page,
          totalItems: 0,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };
    }
    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.displayName', 'author.avatar'])
      .where('post.status = :status', { status: PostStatus.PUBLISHED })
      .andWhere('post.authorId IN (:...followingUserIds)', {
        followingUserIds,
      })
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
