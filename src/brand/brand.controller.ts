import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@Controller('brand')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class BrandController 
{
  constructor(private readonly brandService: BrandService) {}

  //Desc: Admin can Create a new brand
  //Route: POST api/v1/brand
  //Access: Private (admin only)
  @Roles(['admin'])
  @Post()
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createBrandDto: CreateBrandDto) 
  {
    return this.brandService.create(createBrandDto);
  }

  //Desc: Admin or User can Get all brands
  //Route: GET api/v1/brand
  //Access: Public
  @Get()
  findAll() 
  {
    return this.brandService.findAll();
  }

  //Desc: Admin or User can Get a single brand
  //Route: GET api/v1/brand/:id
  //Access: Public
  @Get(':id')
  findOne(@Param('id') id: string) 
  {
    return this.brandService.findOne(id);
  }

  //Desc: Admin can Update a brand
  //Route: PATCH api/v1/brand/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateBrandDto: UpdateBrandDto) 
  {
    return this.brandService.update(id, updateBrandDto);
  }

  //Desc: Admin can Delete a brand
  //Route: DELETE api/v1/brand/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) 
  {
    return this.brandService.remove(id);
  }
}