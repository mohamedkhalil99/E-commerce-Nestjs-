import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, UseFilters } from '@nestjs/common';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { CreateSubCategoryDto } from './dto/create-subCategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subCategory.dto';
import { SubCategoryService } from './subCategory.service';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

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
  @UseFilters(new I18nValidationExceptionFilter())
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createSubCategoryDto: CreateSubCategoryDto, @I18n() i18n: I18nContext) 
  {
    return this.subCategoryService.create(createSubCategoryDto, i18n);
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
  findOne(@Param('id') id: string, @I18n() i18n: I18nContext) 
  {
    return this.subCategoryService.findOne(id, i18n);
  }

  //Desc: Admin can Update a subCategory
  //Route: PATCH api/v1/sub-category/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Patch(':id')
  @UseFilters(new I18nValidationExceptionFilter())
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateSubCategoryDto: UpdateSubCategoryDto, @I18n() i18n: I18nContext) 
  {
    return this.subCategoryService.update(id, updateSubCategoryDto, i18n);
  }

  //Desc: Admin can Delete a subCategory
  //Route: DELETE api/v1/sub-category/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string, @I18n() i18n: I18nContext) 
  {
    return this.subCategoryService.remove(id, i18n);
  }
}