import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const { categories } = createCategoryDto;
    if (!categories || categories.length === 0)
      throw new BadRequestException('Must provide an array of categories');

    const existingCategories = await this.categoryRepository.find({
      where: {
        name: In(categories.map((category) => category.name)),
      },
    });

    if (existingCategories.length > 0) {
      const existingNames = existingCategories.map((category) => category.name);
      throw new ConflictException(
        `Categories with names ${existingNames.join(', ')} already exist`,
      );
    }

    const newCategories = categories.map((category) => {
      return this.categoryRepository.create({
        name: category.name,
      });
    });

    const savedCategories = await this.categoryRepository.save(newCategories);

    return {
      categories: savedCategories,
    };
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }
}
