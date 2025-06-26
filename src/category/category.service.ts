import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class CategoryService 
{
  constructor(@InjectModel(Category.name)private categoryModel:Model<Category>){}
  
  async create(createCategoryDto: CreateCategoryDto, i18n: I18nContext) : Promise<{status: number, message: string, data: Category}>
  {
    //Search for category
    const category = await this.categoryModel.findOne({name:createCategoryDto.name});
    if(category){throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.CATEGORY')}}));}
    //Create category
    const newCategory = await this.categoryModel.create(createCategoryDto);
    return {status:201, message:i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.CATEGORY')}}), data:newCategory};
  }

  async findAll() : Promise<{status: number, length: number, data: Category[]}>
  {
    const categories = await this.categoryModel.find().select('-__v');
    return{status:200, length:categories.length, data:categories};
  }

  async findOne(id: string, i18n: I18nContext) : Promise<{status: number, data: Category}>
  {
    const category = await this.categoryModel.findById(id).select('-__v');
    if(!category){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.CATEGORY')}}) );}
    return {status:200, data:category};
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, i18n: I18nContext) : Promise<{status: number, message: string, data: Category}>
  {
    //Search for category
    const category = await this.categoryModel.findById(id);
    if(!category){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.CATEGORY')}}) );}
    //Update category
    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id,updateCategoryDto,{new:true}).select('-__v');
    return {status:200, message:i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.CATEGORY')}}), data:updatedCategory};
  }

  async remove(id: string, i18n: I18nContext) : Promise<{status: number, message: string}>
  {
    //Search for category
    const category = await this.categoryModel.findById(id);
    if(!category){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.CATEGORY')}}) );}
    //Delete category
    await this.categoryModel.findByIdAndDelete(id);
    return {status:200, message:i18n.t('service.DELETED_SUCCESSFULLY', {args:{property:i18n.t('service.CATEGORY')}}) };
  }
}