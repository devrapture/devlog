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
import { generateSlug } from 'src/common/utils/slug.util';

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
    const draft = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!draft) throw new NotFoundException('Draft not found');

    if (draft.author.id !== userId)
      throw new UnauthorizedException('Not authorized to update this draft');

    let draftCategories: string[] | Category[] | undefined =
      updateDraftDto.categories;
    if (updateDraftDto.categories?.length) {
      draftCategories = await this.categoryRepository.find({
        where: {
          name: In(updateDraftDto.categories),
        },
      });

      if (draftCategories.length !== updateDraftDto.categories.length)
        throw new NotFoundException('One or more categories not found');

      if (updateDraftDto.title) {
        const slug = generateSlug(updateDraftDto.title);
      }

      const draft = this.postRepository.create({
        ...updateDraftDto,
        categories: draftCategories,
      });
    }

    // If categories were provided in the DTO, ensure all of them were found.
    // If not, throw a NotFoundException.
    // if (
    //   categoriesToFind.length > 0 &&
    //   draftCategories.length !== categoriesToFind.length
    // ) {
    //   throw new NotFoundException('One or more categories not found');
    // }

    // Update the draft's properties with the new values from the DTO
    // draft.title = updateDraftDto.title;
    // draft.body = updateDraftDto.body;
    // draft.coverImage = updateDraftDto.coverImage;
    // draft.categories = draftCategories; // Assign the found category entities

    // // Save the updated draft to the database
    // const updatedDraft = await this.postRepository.save(draft);

    // Return the updated draft
    // return { draft: updatedDraft };
  }

  //   async createPost(createPostDto: CreatePostDto) {
  //     const existingCategories = await this.categoryRepository.find({
  //       where: {
  //         name: In(createPostDto.categories),
  //       },
  //     });

  //     if (existingCategories.length !== createPostDto.categories.length) throw new NotFoundException('Category not found');
  //     const newPost = this.postRepository.create({
  //       title: createPostDto.title,
  //       body: createPostDto.body,
  //       coverImage: createPostDto.coverImage,
  //     });
  //     return {
  //       post: createPostDto,
  //     };
  //   }
}
