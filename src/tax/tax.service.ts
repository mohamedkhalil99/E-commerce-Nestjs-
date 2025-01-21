import { Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { Tax } from './tax.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TaxService 
{
  constructor(@InjectModel(Tax.name)private taxModel:Model<Tax>){}
  
  async createOrUpdateTax(createTaxDto: CreateTaxDto) :Promise<{status:number,message:string,data:Tax}>
  {
    const ifTaxExists = await this.taxModel.findOne({});
    if(!ifTaxExists)
      {
        const newTax= await this.taxModel.create(createTaxDto);
        return{status:201,message:'Tax created successfully',data:newTax};
      }
    const updateTax= await this.taxModel.findOneAndUpdate({},createTaxDto,{new:true}).select('-__v');
    return{status:201,message:'Tax Updated successfully',data:updateTax};
  }

  async findTax() :Promise<{status:number,data:Tax[]}>
  {
    const tax= await this.taxModel.find();
    return{status:200,data:tax};
  }
}