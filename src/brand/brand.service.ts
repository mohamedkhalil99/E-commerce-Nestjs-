import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './brand.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class BrandService 
{
  constructor(@InjectModel(Brand.name)private brandModel:Model<Brand>){}
  
  async create(createBrandDto: CreateBrandDto, i18n: I18nContext) : Promise<{status: number, message: string, data: Brand}>
  {
    //Search for brand
    const brand = await this.brandModel.findOne({name:createBrandDto.name});
    if(brand){throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.BRAND')}}));}
    //Create brand
    const newBrand = await this.brandModel.create(createBrandDto);
    return {status:201, message:i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.BRAND')}}), data:newBrand};
  }

  async findAll() :Promise<{status: number, length: number, data: Brand[]}>
  {
    const brands= await this.brandModel.find().select('-__v');
    return{status:200, length:brands.length, data:brands};
  }

  async findOne(id: string, i18n: I18nContext) : Promise<{status: number, data: Brand}>
  {
    const brand = await this.brandModel.findById(id).select('-__v');
    if(!brand){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.BRAND')}}));}
    return {status:200, data:brand};
  }

  async update(id: string, updateBrandDto: UpdateBrandDto, i18n: I18nContext) 
  {
    //Search for brand
    const brand = await this.brandModel.findById(id);
    if(!brand){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.BRAND')}}));}
    //Update brand
    const updatedBrand = await this.brandModel.findByIdAndUpdate(id,updateBrandDto,{new:true}).select('-__v');
    return {status:200, message:i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.BRAND')}}), data:updatedBrand};
  }

  async remove(id: string, i18n: I18nContext) : Promise<{status: number, message: string}>
  {
    //Search for brand
    const brand = await this.brandModel.findById(id);
    if(!brand){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.BRAND')}}));}
    //Delete brand
    await this.brandModel.findByIdAndDelete(id);
    return {status:200, message:i18n.t('service.DELETED_SUCCESSFULLY', {args:{property:i18n.t('service.BRAND')}})};
  }
}