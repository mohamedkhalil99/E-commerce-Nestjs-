import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './coupon.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class CouponService 
{
  constructor(@InjectModel(Coupon.name)private couponModel:Model<Coupon>){}
  
  async create(createCouponDto: CreateCouponDto, i18n: I18nContext) : Promise<{status: number, message: string, data: Coupon}>
  {
    //Check if coupon exists
    const coupon = await this.couponModel.findOne({name:createCouponDto.name});
    if(coupon){throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.COUPON')}}));}
    //If Date Is Expired
    const isExpired = new Date(createCouponDto.expireDate) > new Date();
    if(!isExpired){throw new ConflictException(i18n.t('service.COUPON_MUST_BE_IN_FUTURE'));}
    //Create coupon
    const newCoupon = await this.couponModel.create(createCouponDto);
    return {status:201, message:i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.COUPON')}}), data:newCoupon};
  }

  async findAll() : Promise<{status: number, length: number, data: Coupon[]}>
  {
    const coupons = await this.couponModel.find().select('-__v');
    return {status:200, length:coupons.length, data:coupons};
  }

  async findOne(id: string, i18n: I18nContext) : Promise<{status: number, data: Coupon}>
  {
    //Search for coupon
    const coupon = await this.couponModel.findById(id).select('-__v');
    if(!coupon){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.COUPON')}}));}
    return {status:200, data:coupon};
  }

  async update(id: string, updateCouponDto: UpdateCouponDto, i18n: I18nContext) : Promise<{status: number, message: string, data: Coupon}>
  {
    //Search for coupon
    const coupon = await this.couponModel.findById(id).select('-__v');
    if(!coupon){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.COUPON')}}));}
    //If Date Is Expired
    const isExpired = new Date(updateCouponDto.expireDate) > new Date();
    if(!isExpired){throw new ConflictException(i18n.t('service.COUPON_MUST_BE_IN_FUTURE'));}
    //Update coupon
    const updatedCoupon = await this.couponModel.findByIdAndUpdate(id,updateCouponDto,{new:true}).select('-__v');
    return {status:200, message:i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.COUPON')}}), data:updatedCoupon};
  }

  async remove(id: string, i18n: I18nContext) 
  {
    //Search for coupon
    const coupon = await this.couponModel.findById(id).select('-__v');
    if(!coupon){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.COUPON')}}));}
    //Delete coupon
    await this.couponModel.findByIdAndDelete(id);
    return {status:200, message:i18n.t('service.DELETED_SUCCESSFULLY', {args:{property:i18n.t('service.COUPON')}})};
  }
}