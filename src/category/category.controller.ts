import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

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
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createCategoryDto: CreateCategoryDto) 
  {
    return this.categoryService.create(createCategoryDto);
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
  findOne(@Param('id') id: string) 
  {
    return this.categoryService.findOne(id);
  }

  //Desc: Admin can Update a category
  //Route: PATCH api/v1/category/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateCategoryDto: UpdateCategoryDto) 
  {
    return this.categoryService.update(id, updateCategoryDto);
  }

  //Desc: Admin can Delete a category
  //Route: DELETE api/v1/category/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) 
  {
    return this.categoryService.remove(id);
  }
}