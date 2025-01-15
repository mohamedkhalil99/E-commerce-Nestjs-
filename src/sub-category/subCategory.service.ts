import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubCategory } from './subCategory.schema';
import { CreateSubCategoryDto } from './dto/create-subCategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subCategory.dto';
import { Category } from 'src/category/category.schema';

@Injectable()
export class SubCategoryService   
{  
  constructor(@InjectModel(SubCategory.name)private subCategoryModel:Model<SubCategory>,
  @InjectModel(Category.name)private categoryModel:Model<Category>){}
  
  async create(createSubCategoryDto: CreateSubCategoryDto) : Promise<{status: number, message: string, data: SubCategory}>
  {
    //Search for subCategory
    const subCategory = await this.subCategoryModel.findOne({name:createSubCategoryDto.name});
    if(subCategory){throw new ConflictException('SubCategory already exists');}
    //Check if category exists
    const category = await this.categoryModel.findById(createSubCategoryDto.category);
    if(!category){throw new NotFoundException('Category not found');}
    //Create subCategory
    const newSubCategory = await (await this.subCategoryModel.create(createSubCategoryDto)).populate('category');
    return {status:201,message:'SubCategory created successfully',data:newSubCategory};
  }

  async findAll() : Promise<{status: number, length: number, data: SubCategory[]}>
  {
    const subCategories = await this.subCategoryModel.find().select('-__v').populate('category');
    return{status:200,length:subCategories.length,data:subCategories};
  }

  async findOne(id: string) : Promise<{status: number, data: SubCategory}>
  {
    const subCategory = (await this.subCategoryModel.findById(id).select('-__v').populate('category'));
    if(!subCategory){throw new NotFoundException('SubCategory not found');}
    return {status:200,data:subCategory};
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) : Promise<{status: number, message: string, data: SubCategory}>
  {
    //Search for subCategory
    const subCategory = await this.subCategoryModel.findById(id);
    if(!subCategory){throw new NotFoundException('SubCategory not found');}
    //Update subCategory
    const updatedSubCategory = (await this.subCategoryModel.findByIdAndUpdate(id,updateSubCategoryDto,{new:true}).select('-__v').populate('category'));
    return {status:200,message:'SubCategory updated successfully',data:updatedSubCategory};
  }

  async remove(id: string) : Promise<{status: number, message: string}>
  {
    //Search for subCategory
    const subCategory = await this.subCategoryModel.findById(id);
    if(!subCategory){throw new NotFoundException('SubCategory not found');}
    //Delete subCategory
    await this.subCategoryModel.findByIdAndDelete(id);
    return {status:200,message:'SubCategory deleted successfully'};  
  }
}