import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { CreateSubCategoryDto } from './dto/create-subCategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subCategory.dto';
import { SubCategoryService } from './subCategory.service';

@Controller('sub-category')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class SubCategoryController 
{
  constructor(private readonly subCategoryService: SubCategoryService) {}

  //Desc: Admin can Create a new subCategory
  //Route: POST api/v1/sub-category
  //Access: Private (admin only)
  @Roles(['admin'])
  @Post()
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createSubCategoryDto: CreateSubCategoryDto) 
  {
    return this.subCategoryService.create(createSubCategoryDto);
  }

  //Desc: Admin or User can Get all subCategories
  //Route: GET api/v1/sub-category
  //Access: Public
  @Get()
  findAll() 
  {
    return this.subCategoryService.findAll();
  }

  //Desc: Admin or User can Get a single subCategory
  //Route: GET api/v1/sub-category/:id
  //Access: Public
  @Get(':id')
  findOne(@Param('id') id: string) 
  {
    return this.subCategoryService.findOne(id);
  }

  //Desc: Admin can Update a subCategory
  //Route: PATCH api/v1/sub-category/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateSubCategoryDto: UpdateSubCategoryDto) 
  {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  //Desc: Admin can Delete a subCategory
  //Route: DELETE api/v1/sub-category/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) 
  {
    return this.subCategoryService.remove(id);
  }
}