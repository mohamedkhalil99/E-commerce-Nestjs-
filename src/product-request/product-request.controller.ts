import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { ProductRequestService } from './product-request.service';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';

@Controller('product-request')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class ProductRequestController 
{
  constructor(private readonly productRequestService: ProductRequestService) {}

  //Desc: User can Create a new Product Request
  //Route: POST api/v1/product-request
  //Access: Private (user only)
  @Roles(['user'])
  @Post()
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createProductRequestDto: CreateProductRequestDto,@Req() req) 
  {
    return this.productRequestService.create({...createProductRequestDto,user: req.user.id});
  }

  //Desc: Admin can Get All Product Requests
  //Route: GET api/v1/product-request
  //Access: Private (admin)
  @Roles(['admin'])
  @Get()
  findAll() 
  {
    return this.productRequestService.findAll();
  }

  //Desc: Admin can Get One Product Request | User can Get Only his Product Request
  //Route: GET api/v1/product-request
  //Access: Private (admin and user)
  @Roles(['admin','user'])
  @Get(':id')
  findOne(@Param('id') id: string,@Req() req) 
  {
    return this.productRequestService.findOne(id,req);
  }

  //Desc: User can Update Only his Product Request
  //Route: PATCH api/v1/product-request
  //Access: Private (user)
  @Roles(['user'])
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateProductRequestDto: UpdateProductRequestDto,@Req() req) 
  {
    return this.productRequestService.update(id,/* {...*/updateProductRequestDto/*, user:req.user.id}*/, req);
  }

  //Desc: User can Delete Only his Product Request
  //Route: Delete api/v1/product-request
  //Access: Private (user)
  @Roles(['user'])
  @Delete(':id')
  remove(@Param('id') id: string,@Req() req) 
  {
    return this.productRequestService.remove(id,req);
  }
}