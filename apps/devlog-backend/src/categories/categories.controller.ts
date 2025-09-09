import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CreateCategoryDto } from './create-category.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ResponseMessage('Categories retrieved successfully')
  @ApiOperation({
    summary: 'Get all categories',
  })
  @Get()
  getCategories() {
    return this.categoriesService.findAll();
  }

  @ResponseMessage('Category created successfully')
  @ApiOperation({
    summary: 'Create category',
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    schema: {
      example: {
        success: true,
        message: 'Category created successfully',
        data: {
          categories: [
            {
              id: '0a007c11-0270-44cc-9d47-5ad0d62cf2a8',
              name: 'react',
              createdAt: '2025-09-07T18:25:04.522Z',
              updatedAt: '2025-09-07T18:25:04.522Z',
            },
            {
              id: '0e741422-610a-4022-86b4-f10649cd27dd',
              name: 'javascript',
              createdAt: '2025-09-07T18:25:04.522Z',
              updatedAt: '2025-09-07T18:25:04.522Z',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Categories already exist',
    schema: {
      example: {
        success: false,
        statusCode: 409,
        message: 'Categories with names react, javascript already exist',
      },
    },
  })
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }
}
