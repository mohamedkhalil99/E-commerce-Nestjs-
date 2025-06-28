import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductRequest } from './product-request.schema';
import { CreateProductRequestDto } from './dto/create-product-request.dto';
import { I18nContext } from 'nestjs-i18n';

interface NewCreateProductRequestDto extends CreateProductRequestDto
{
  user:string;//to add user without dto
}

@Injectable()
export class ProductRequestService 
{
  constructor(@InjectModel(ProductRequest.name)private productRequestModel:Model<ProductRequest>){}
  
  async create(createProductRequestDto: NewCreateProductRequestDto, i18n: I18nContext) :Promise<{status:number,message:string,data:ProductRequest}>
  {
    //Search for productRequest
    const productRequest = await this.productRequestModel.findOne({titleNeed:createProductRequestDto.titleNeed, user: createProductRequestDto.user});
    if(productRequest){throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.PRODUCT_REQUEST')}}));}
    //Create productRequest
    const newProductRequest = await (await this.productRequestModel.create(createProductRequestDto)).populate('user', '-password -__v -role -verificationCode -phoneNumber');
    return {status:201, message:i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.PRODUCT_REQUEST')}}), data:newProductRequest};
  }

  async findAll() :Promise<{status:number,length:number,data:ProductRequest[]}>
  {
    const productRequest = await this.productRequestModel.find().select('-__v').populate('user', '-password -__v -role -verificationCode -phoneNumber');
    return{status:200,length:productRequest.length,data:productRequest};
  }

  async findOne(id: string, req:any, i18n: I18nContext) :Promise<{status:number,data:ProductRequest}>
  {
    //Get User ID from the Request and Product Request
    const userRequestId=req.user.id;
    const productRequest = (await this.productRequestModel.findById(id).select('-__v').populate('user', '-password -__v -role -verificationCode -phoneNumber'));
    //Make sure that admin and User can Get his Prodct Request 
    if(userRequestId.toString() !== productRequest.user.id.toString() && req.user.role !== 'admin'){throw new UnauthorizedException();}
    if(!productRequest){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.PRODUCT_REQUEST')}}));}
    return {status:200, data:productRequest};  
  }

  async update(id: string, updateProductRequestDto: any, req:any, i18n: I18nContext) :Promise<{status:number,message:string,data:ProductRequest}>
  {
    //Get User ID from the Request and Product Request
    const userRequestId=req.user.id;
    const productRequest = (await this.productRequestModel.findById(id).select('-__v').populate('user', '-password -__v -role -verificationCode -phoneNumber'));
    //Make sure that User can Update his Prodct Request 
    if(userRequestId.toString() !== productRequest.user.id.toString()){throw new UnauthorizedException();}
    if(!productRequest){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.PRODUCT_REQUEST')}}));}
    //Update productRequest
    const updatedproductRequest = (await this.productRequestModel.findByIdAndUpdate(id,updateProductRequestDto,{new:true}).select('-__v').populate('user', '-password -__v -role -verificationCode -phoneNumber'));
    return {status:200, message:i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.PRODUCT_REQUEST')}}), data:updatedproductRequest};
  }

  async remove(id: string, req:any, i18n: I18nContext) :Promise<{status:number,message:string}>
  {
    //Get User ID from the Request and Product Request
    const userRequestId=req.user.id;
    const productRequest = (await this.productRequestModel.findById(id).select('-__v').populate('user', '-password -__v -role -verificationCode -phoneNumber'));
    //Make sure that User can Delete his Prodct Request 
    if(userRequestId.toString() !== productRequest.user.id.toString()){throw new UnauthorizedException();}
    if(!productRequest){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.PRODUCT_REQUEST')}}));}
    //Delete productRequest  
    await this.productRequestModel.findByIdAndDelete(id);
    return {status:200, message:i18n.t('service.DELETED_SUCCESSFULLY', {args:{property:i18n.t('service.PRODUCT_REQUEST')}})};
  }
}