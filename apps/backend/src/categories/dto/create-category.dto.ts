import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryInput {
  @ApiProperty({ description: 'Category name', example: 'react' })
  @IsString()
  name: string;
}

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Array of categories to create',
    type: [CategoryInput],
    example: [{ name: 'react' }, { name: 'javascript' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryInput)
  categories: CategoryInput[];
}
