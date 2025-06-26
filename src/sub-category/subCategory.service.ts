import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory } from './subCategory.schema';
import { CreateSubCategoryDto } from './dto/create-subCategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subCategory.dto';
import { Category } from 'src/category/category.schema';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class SubCategoryService   
{  
  constructor(@InjectModel(SubCategory.name)private subCategoryModel:Model<SubCategory>,
  @InjectModel(Category.name)private categoryModel:Model<Category>){}
  
  async create(createSubCategoryDto: CreateSubCategoryDto, i18n: I18nContext) : Promise<{status: number, message: string, data: SubCategory}>
  {
    //Search for subCategory
    const subCategory = await this.subCategoryModel.findOne({name:createSubCategoryDto.name});
    if(subCategory){throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.SUB_CATEGORY')}}));}
    //Check if category exists
    const category = await this.categoryModel.findById(createSubCategoryDto.category);
    if(!category){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.CATEGORY')}}));}
    //Create subCategory
    const newSubCategory = await (await this.subCategoryModel.create(createSubCategoryDto)).populate('category');
    return {status:201, message:i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.SUB_CATEGORY')}}), data:newSubCategory};
  }

  async findAll() : Promise<{status: number, length: number, data: SubCategory[]}>
  {
    const subCategories = await this.subCategoryModel.find().select('-__v').populate('category');
    return{status:200, length:subCategories.length, data:subCategories};
  }

  async findOne(id: string, i18n: I18nContext) : Promise<{status: number, data: SubCategory}>
  {
    const subCategory = (await this.subCategoryModel.findById(id).select('-__v').populate('category'));
    if(!subCategory){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.SUB_CATEGORY')}}));}
    return {status:200, data:subCategory};
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto, i18n: I18nContext) : Promise<{status: number, message: string, data: SubCategory}>
  {
    //Search for subCategory
    const subCategory = await this.subCategoryModel.findById(id);
    if(!subCategory){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.SUB_CATEGORY')}}));}
    //Update subCategory
    const updatedSubCategory = (await this.subCategoryModel.findByIdAndUpdate(id,updateSubCategoryDto,{new:true}).select('-__v').populate('category'));
    return {status:200, message:i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.SUB_CATEGORY')}}), data:updatedSubCategory};
  }

  async remove(id: string, i18n: I18nContext) : Promise<{status: number, message: string}>
  {
    //Search for subCategory
    const subCategory = await this.subCategoryModel.findById(id);
    if(!subCategory){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.SUB_CATEGORY')}}));}
    //Delete subCategory
    await this.subCategoryModel.findByIdAndDelete(id);
    return {status:200, message:i18n.t('service.DELETED_SUCCESSFULLY', {args:{property:i18n.t('service.SUB_CATEGORY')}})};
  }
}