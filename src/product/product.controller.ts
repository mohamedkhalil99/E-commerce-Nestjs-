import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

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
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createProductDto: CreateProductDto) 
  {
    return this.productService.create(createProductDto);
  }

  //Desc: Anyone can Get All Products
  //Route: POST api/v1/product
  //Access: Public
  @Get()
  findAll(@Query() query: any) 
  {
    return this.productService.findAll(query);
  }

  //Desc: Anyone can Get a Product
  //Route: POST api/v1/product
  //Access: Public
  @Get(':id')
  findOne(@Param('id') id: string) 
  {
    return this.productService.findOne(id);
  }

  //Desc: Admin can Update a Product
  //Route: POST api/v1/product
  //Access: Private (admin)
  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateProductDto: UpdateProductDto) 
  {
    return this.productService.update(id, updateProductDto);
  }

  //Desc: Admin or User can Delete a Product
  //Route: POST api/v1/product
  //Access: Private (admin)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) 
  {
    return this.productService.remove(id);
  }
}