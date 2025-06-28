import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Req, UseFilters } from '@nestjs/common';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { ProductRequestService } from './product-request.service';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { UpdateProductRequestDto } from './dto/update-product-request.dto';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

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
  @UseFilters(new I18nValidationExceptionFilter())
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createProductRequestDto: CreateProductRequestDto, @Req() req, @I18n() i18n: I18nContext) 
  {
    return this.productRequestService.create({...createProductRequestDto, user: req.user.id}, i18n);
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
  //Route: GET api/v1/product-request/:id
  //Access: Private (admin and user)
  @Roles(['admin','user'])
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req, @I18n() i18n: I18nContext) 
  {
    return this.productRequestService.findOne(id, req, i18n);
  }

  //Desc: User can Update Only his Product Request
  //Route: PATCH api/v1/product-request/:id
  //Access: Private (user)
  @Roles(['user'])
  @Patch(':id')
  @UseFilters(new I18nValidationExceptionFilter())
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateProductRequestDto: UpdateProductRequestDto,@Req() req, @I18n() i18n: I18nContext) 
  {
    return this.productRequestService.update(id, updateProductRequestDto, req, i18n);
  }

  //Desc: User can Delete Only his Product Request
  //Route: Delete api/v1/product-request/:id
  //Access: Private (user)
  @Roles(['user'])
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req, @I18n() i18n: I18nContext) 
  {
    return this.productRequestService.remove(id, req, i18n);
  }
}