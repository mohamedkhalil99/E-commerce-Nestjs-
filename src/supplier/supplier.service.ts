import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './supplier.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class SupplierService 
{
  constructor(@InjectModel(Supplier.name)private supplierModel:Model<Supplier>){}
  
  async create(createSupplierDto: CreateSupplierDto, i18n: I18nContext) : Promise<{status:number,message:string,data:Supplier}>
  {
    //Search for Supplier
    const supplier = await this.supplierModel.findOne({name:createSupplierDto.name});
    if(supplier){throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.SUPPLIER')}}));}
    //Create New Supplier
    const newSupplier = (await this.supplierModel.create(createSupplierDto));
    return {status:201, message:i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.SUPPLIER')}}), data:newSupplier};
  }

  async findAll() : Promise<{status:number,length:number,data:Supplier[]}>
  {
    const suppliers = await this.supplierModel.find().select('-__v');
    return{status:200, length:suppliers.length, data:suppliers};
  }

  async findOne(id: string, i18n: I18nContext) : Promise<{status:number,data:Supplier}>
  {
    const supplier = (await this.supplierModel.findById(id).select('-__v'));
    if(!supplier){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.SUPPLIER')}}));}
    return {status:200, data:supplier};
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto, i18n: I18nContext) : Promise<{status:number,message:string,data:Supplier}>
  {
    //Search for Supplier
    const supplier = (await this.supplierModel.findById(id).select('-__v'));
    if(!supplier){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.SUPPLIER')}}));}
    //Update The Supplier
    const updatedSupplier = (await this.supplierModel.findByIdAndUpdate(id,updateSupplierDto,{new:true}).select('-__v'));
    return {status:200, message:i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.SUPPLIER')}}), data:updatedSupplier};
  }

  async remove(id: string, i18n: I18nContext) : Promise<{status:number,message:string}>
  {
    //Search for Supplier
    const supplier = (await this.supplierModel.findById(id).select('-__v'));
    if(!supplier){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.SUPPLIER')}}));}
    //Delete The Supplier
    await this.supplierModel.findByIdAndDelete(id);
    return {status:200, message:i18n.t('service.DELETED_SUCCESSFULLY', {args:{property:i18n.t('service.SUPPLIER')}})};  
  }
}