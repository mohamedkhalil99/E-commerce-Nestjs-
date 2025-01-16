import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './coupon.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CouponService 
{
    constructor(@InjectModel(Coupon.name)private couponModel:Model<Coupon>){}
  
  async create(createCouponDto: CreateCouponDto) : Promise<{status: number, message: string, data: Coupon}>
  {
    //Check if coupon exists
    const coupon = await this.couponModel.findOne({name:createCouponDto.name});
    if(coupon){throw new ConflictException('Coupon already exists');}
    //If Date Is Expired
    const isExpired = new Date(createCouponDto.expireDate) > new Date();
    if(!isExpired){throw new ConflictException('Coupon expire date must be a future date');}
    //Create coupon
    const newCoupon = await this.couponModel.create(createCouponDto);
    return {status:201,message:'Coupon created successfully',data:newCoupon};
  }

  async findAll() : Promise<{status: number, length: number, data: Coupon[]}>
  {
    const coupons = await this.couponModel.find().select('-__v');
    return {status:200,length:coupons.length,data:coupons};
  }

  async findOne(id: string) : Promise<{status: number, data: Coupon}>
  {
    //Search for coupon
    const coupon = await this.couponModel.findById(id).select('-__v');
    if(!coupon){throw new NotFoundException('Coupon not found');}
    return {status:200,data:coupon};
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) : Promise<{status: number, message: string, data: Coupon}>
  {
    //Search for coupon
    const coupon = await this.couponModel.findById(id).select('-__v');
    if(!coupon){throw new NotFoundException('Coupon not found');}
    //Update coupon
    const updatedCoupon = await this.couponModel.findByIdAndUpdate(id,updateCouponDto,{new:true}).select('-__v');
    return {status:200,message:'Coupon updated successfully',data:updatedCoupon};
  }

  async remove(id: string) 
  {
    //Search for coupon
    const coupon = await this.couponModel.findById(id).select('-__v');
    if(!coupon){throw new NotFoundException('Coupon not found');}  
    //Delete coupon
    await this.couponModel.findByIdAndDelete(id);
    return {status:200,message:'Coupon deleted successfully'};
  }
}