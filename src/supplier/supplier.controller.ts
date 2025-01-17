import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

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
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createSupplierDto: CreateSupplierDto) 
  {
    return this.supplierService.create(createSupplierDto);
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
  findOne(@Param('id') id: string) 
  {
    return this.supplierService.findOne(id);
  }

  //Desc: Admin can Update a supplier
  //Route: PATCH api/v1/supplier/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateSupplierDto: UpdateSupplierDto) 
  {
    return this.supplierService.update(id, updateSupplierDto);
  }

  //Desc: Admin can Delete a supplier
  //Route: DELETE api/v1/supplier/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) 
  {
    return this.supplierService.remove(id);
  }
}