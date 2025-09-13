import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiUnAuthenticatedEndpoint } from 'src/common/decorators/api-responses.decorator';
import { CategoryResponseDto } from './dto/category-response.dto';
import { ErrorResponseDto } from 'src/common/dto/responses/error-response.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ResponseMessage('Categories retrieved successfully')
  @ApiUnAuthenticatedEndpoint(
    'Get all categories',
    HttpStatus.OK,
    CategoryResponseDto,
  )
  @Get()
  getCategories() {
    return this.categoriesService.findAll();
  }

  @ResponseMessage('Category created successfully')
  @ApiUnAuthenticatedEndpoint(
    'Create category',
    HttpStatus.OK,
    CategoryResponseDto,
  )
  @ApiResponse({
    status: 409,
    description: 'Categories already exist',
    type: ErrorResponseDto,
  })
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }
}
