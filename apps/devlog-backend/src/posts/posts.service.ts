import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Category } from '../categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

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

  async updateDraft(userId: string, id: string, updateDraftDto: CreatePostDto) {
    const existingDraft = await this.postRepository.findOne({
      where: {
        id,
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
}
