import { Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { Tax } from './tax.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class TaxService 
{
  constructor(@InjectModel(Tax.name)private taxModel:Model<Tax>){}
  
  async createOrUpdateTax(createTaxDto: CreateTaxDto, i18n: I18nContext) :Promise<{status:number,message:string,data:Tax}>
  {
    const ifTaxExists = await this.taxModel.findOne({});
    if(!ifTaxExists)
      {
        const newTax= await this.taxModel.create(createTaxDto);
        return{status:201, message:i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.TAX')}}), data:newTax};//'Tax created successfully'
      }
    const updateTax= await this.taxModel.findOneAndUpdate({},createTaxDto,{new:true}).select('-__v');
    return{status:201, message:i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.TAX')}}), data:updateTax};//'Tax Updated successfully'
  }

  async findTax() :Promise<{status:number,data:Tax[]}>
  {
    const tax= await this.taxModel.find();
    return{status:200,data:tax};
  }
}