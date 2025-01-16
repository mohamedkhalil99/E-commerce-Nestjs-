import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@Controller('coupon')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class CouponController 
{
  constructor(private readonly couponService: CouponService) {}

  //Desc: Admin can Create a new coupon
  //Route: POST api/v1/coupon
  //Access: Private (admin only)
  @Roles(['admin'])
  @Post()
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createCouponDto: CreateCouponDto) 
  {
    return this.couponService.create(createCouponDto);
  }

  //Desc: Admin can Get all coupons
  //Route: GET api/v1/coupon
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get()
  findAll() 
  {
    return this.couponService.findAll();
  }

  //Desc: Admin can Get a single coupon
  //Route: GET api/v1/coupon/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get(':id')
  findOne(@Param('id') id: string) 
  {
    return this.couponService.findOne(id);
  }

  //Desc: Admin can Update a coupon
  //Route: PATCH api/v1/coupon/:id
  //Access: Private (admin only)  
  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateCouponDto: UpdateCouponDto) 
  {
    return this.couponService.update(id, updateCouponDto);
  }

  //Desc: Admin can Delete a coupon
  //Route: DELETE api/v1/coupon/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) 
  {
    return this.couponService.remove(id);
  }
}