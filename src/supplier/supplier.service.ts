import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './supplier.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SupplierService 
{
  constructor(@InjectModel(Supplier.name)private supplierModel:Model<Supplier>){}
  
  async create(createSupplierDto: CreateSupplierDto) : Promise<{status:number,message:string,data:Supplier}>
  {
    //Search for Supplier
    const supplier = await this.supplierModel.findOne({name:createSupplierDto.name});
    if(supplier){throw new ConflictException('Supplier already exists');}
    //Create New Supplier
    const newSupplier = (await this.supplierModel.create(createSupplierDto));
    return {status:201,message:'Supplier created successfully',data:newSupplier};
  }

  async findAll() : Promise<{status:number,length:number,data:Supplier[]}>
  {
    const suppliers = await this.supplierModel.find().select('-__v');
    return{status:200,length:suppliers.length,data:suppliers};
  }

  async findOne(id: string) : Promise<{status:number,data:Supplier}>
  {
    const supplier = (await this.supplierModel.findById(id).select('-__v'));
    if(!supplier){throw new NotFoundException('Supplier not found');}
    return {status:200,data:supplier};
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) : Promise<{status:number,message:string,data:Supplier}>
  {
    //Search for Supplier
    const supplier = (await this.supplierModel.findById(id).select('-__v'));
    if(!supplier){throw new NotFoundException('Supplier not found');}
    //Update The Supplier
    const updatedSupplier = (await this.supplierModel.findByIdAndUpdate(id,updateSupplierDto,{new:true}).select('-__v'));
    return {status:200,message:'Supplier updated successfully',data:updatedSupplier};
  }

  async remove(id: string) : Promise<{status:number,message:string}>
  {
    //Search for Supplier
    const supplier = (await this.supplierModel.findById(id).select('-__v'));
    if(!supplier){throw new NotFoundException('Supplier not found');}
    //Delete The Supplier
    await this.supplierModel.findByIdAndDelete(id);
    return {status:200,message:'Supplier deleted successfully'};  
  }
}