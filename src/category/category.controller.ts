import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, UseFilters } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('category')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class CategoryController 
{
  constructor(private readonly categoryService: CategoryService) {}

  //Desc: Admin can Create a new category
  //Route: POST api/v1/category
  //Access: Private (admin only)
  @Roles(['admin'])
  @Post()
  @UseFilters(new I18nValidationExceptionFilter())
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createCategoryDto: CreateCategoryDto, @I18n() i18n: I18nContext) 
  {
    return this.categoryService.create(createCategoryDto, i18n);
  }

  //Desc: Admin or User can Get all categories
  //Route: GET api/v1/category
  //Access: Public
  @Get()
  findAll() 
  {
    return this.categoryService.findAll();
  }

  //Desc: Admin or User can Get a single category
  //Route: GET api/v1/category/:id
  //Access: Public
  @Get(':id')
  findOne(@Param('id') id: string, @I18n() i18n: I18nContext) 
  {
    return this.categoryService.findOne(id, i18n);
  }

  //Desc: Admin can Update a category
  //Route: PATCH api/v1/category/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Patch(':id')
  @UseFilters(new I18nValidationExceptionFilter())
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateCategoryDto: UpdateCategoryDto, @I18n() i18n: I18nContext) 
  {
    return this.categoryService.update(id, updateCategoryDto, i18n);
  }

  //Desc: Admin can Delete a category
  //Route: DELETE api/v1/category/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string, @I18n() i18n: I18nContext) 
  {
    return this.categoryService.remove(id, i18n);
  }
}