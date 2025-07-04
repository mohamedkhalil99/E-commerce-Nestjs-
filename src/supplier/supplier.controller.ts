import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, UseFilters } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('supplier')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class SupplierController 
{
  constructor(private readonly supplierService: SupplierService) {}

  //Desc: Admin can Create a new supplier
  //Route: POST api/v1/supplier
  //Access: Private (admin only)
  @Roles(['admin'])
  @Post()
  @UseFilters(new I18nValidationExceptionFilter())
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createSupplierDto: CreateSupplierDto, @I18n() i18n: I18nContext) 
  {
    return this.supplierService.create(createSupplierDto, i18n);
  }

  //Desc: Admin or User can Get All Suppliers
  //Route: GET api/v1/supplier
  //Access: Public 
  @Get()
  findAll() 
  {
    return this.supplierService.findAll();
  }

  //Desc: Admin or User can Get a supplier by id
  //Route: Get api/v1/supplier/:id
  //Access: Public
  @Get(':id')
  findOne(@Param('id') id: string, @I18n() i18n: I18nContext) 
  {
    return this.supplierService.findOne(id, i18n);
  }

  //Desc: Admin can Update a supplier
  //Route: PATCH api/v1/supplier/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Patch(':id')
  @UseFilters(new I18nValidationExceptionFilter())
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateSupplierDto: UpdateSupplierDto, @I18n() i18n: I18nContext) 
  {
    return this.supplierService.update(id, updateSupplierDto, i18n);
  }

  //Desc: Admin can Delete a supplier
  //Route: DELETE api/v1/supplier/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string, @I18n() i18n: I18nContext) 
  {
    return this.supplierService.remove(id, i18n);
  }
}