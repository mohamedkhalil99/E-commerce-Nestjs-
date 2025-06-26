import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Query, UseFilters } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('product')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class ProductController 
{
  constructor(private readonly productService: ProductService) {}

  //Desc: Admin can Create a new Product
  //Route: POST api/v1/product
  //Access: Private (admin only)
  @Roles(['admin'])
  @Post()
  @UseFilters(new I18nValidationExceptionFilter())
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createProductDto: CreateProductDto, @I18n() i18n: I18nContext) 
  {
    return this.productService.create(createProductDto, i18n);
  }

  //Desc: Anyone can Get All Products
  //Route: GET api/v1/product
  //Access: Public
  @Get()
  findAll(@Query() query: any) 
  {
    return this.productService.findAll(query);
  }

  //Desc: Anyone can Get a Product
  //Route: GET api/v1/product/:id
  //Access: Public
  @Get(':id')
  findOne(@Param('id') id: string, @I18n() i18n: I18nContext) 
  {
    return this.productService.findOne(id, i18n);
  }

  //Desc: Admin can Update a Product
  //Route: PATCH api/v1/product/:id
  //Access: Private (admin)
  @Roles(['admin'])
  @Patch(':id')
  @UseFilters(new I18nValidationExceptionFilter())
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateProductDto: UpdateProductDto, @I18n() i18n: I18nContext) 
  {
    return this.productService.update(id, updateProductDto, i18n);
  }

  //Desc: Admin or User can Delete a Product
  //Route: DELETE api/v1/product/:id
  //Access: Private (admin)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string, @I18n() i18n: I18nContext) 
  {
    return this.productService.remove(id, i18n);
  }
}