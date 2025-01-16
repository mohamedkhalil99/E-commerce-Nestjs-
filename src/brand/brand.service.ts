import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './brand.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BrandService 
{
  constructor(@InjectModel(Brand.name)private brandModel:Model<Brand>){}
  
  async create(createBrandDto: CreateBrandDto) : Promise<{status: number, message: string, data: Brand}>
  {
    //Search for brand
    const brand = await this.brandModel.findOne({name:createBrandDto.name});
    if(brand){throw new ConflictException('Brand already exists');}
    //Create brand
    const newBrand = await this.brandModel.create(createBrandDto);
    return {status:201,message:'Brand created successfully',data:newBrand};
  }

  async findAll() :Promise<{status: number, length: number, data: Brand[]}>
  {
    const brands= await this.brandModel.find().select('-__v');
    return{status:200,length:brands.length,data:brands};
  }

  async findOne(id: string) : Promise<{status: number, data: Brand}>
  {
    const brand = await this.brandModel.findById(id).select('-__v');
    if(!brand){throw new NotFoundException('Brand not found');}
    return {status:200,data:brand};
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) 
  {
    //Search for brand
    const brand = await this.brandModel.findById(id);
    if(!brand){throw new NotFoundException('Brand not found');}
    //Update brand
    const updatedBrand = await this.brandModel.findByIdAndUpdate(id,updateBrandDto,{new:true}).select('-__v');
    return {status:200,message:'Brand updated successfully',data:updatedBrand};
  }

  async remove(id: string) : Promise<{status: number, message: string}>
  {
    //Search for brand
    const brand = await this.brandModel.findById(id);
    if(!brand){throw new NotFoundException('Brand not found');}
    //Delete brand
    await this.brandModel.findByIdAndDelete(id);
    return {status:200,message:'Brand deleted successfully'};
  }
}