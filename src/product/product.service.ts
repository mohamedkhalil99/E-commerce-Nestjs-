import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/subCategory.schema';
import { Brand } from 'src/brand/brand.schema';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class ProductService 
{
  constructor(@InjectModel(Product.name)private productModel:Model<Product>,
              @InjectModel(Category.name)private categoryModel:Model<Category>,
              @InjectModel(SubCategory.name)private subCategoryModel:Model<SubCategory>,
              @InjectModel(Brand.name)private brandModel:Model<Brand>){}
  
  async create(createProductDto: CreateProductDto, i18n: I18nContext) :Promise<{status:number,message:string,data:Product}>
  {
    //Search for Product
    const product = await this.productModel.findOne({title:createProductDto.title});
    if(product){throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.PRODUCT')}}));}
    //Check if Category exists
    const category = await this.categoryModel.findById(createProductDto.category);
    if(!category){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.CATEGORY')}}));}
    //Check if subCategory exists
    const subCategory = await this.subCategoryModel.findById(createProductDto.subCategory);
    if(!subCategory){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.SUB_CATEGORY')}}));}
    //Check if Brand exists
    const brand = await this.brandModel.findById(createProductDto.brand);
    if(!brand){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.BRAND')}}));} 
    //check if priceAfterDiscount is less than price
    const price= createProductDto.price;
    const priceAfterDiscount= createProductDto?.priceAfterDiscount ?? 0;
    if(priceAfterDiscount>price){throw new ConflictException(i18n.t('service.AFTER_DIS_CANNOT_GREATER_PRICE'));} 
    //Create New Product
    const newProduct = await (await this.productModel.create(createProductDto)).populate('category subCategory brand','-__v');
    return {status:201, message:i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.PRODUCT')}}), data:newProduct};
  }
  
  async findAll(query) :Promise<{status:number,isEmpty:string,length:number,data:Product[]}>
  {
    //Filter
    // eslint-disable-next-line prefer-const
    let queryRequest={...query};
    const queryRemoveFields=['page','limit','keyword','sort','fields','category','subCategory','brand'];
    queryRemoveFields.forEach(field => delete queryRequest[field]);
    queryRequest=JSON.parse(JSON.stringify(queryRequest).replace(/gte|gt|lte|lt/g,match=>`$${match}`));
    //Pagination
    const page= query?.page || 1;
    const limit= query?.limit || 10;
    const skip = (page-1)*limit;
    //Sortng
    const sort= query?.sort || 'asc';
    //Fields
    const fields = query?.fields || '';
    //Search
    // eslint-disable-next-line prefer-const
    let findData ={...queryRequest};
    if(query.keyword){findData.$or=[{title:{$regex:query.keyword,$options:'i'}},{description :{$regex:query.keyword,$options:'i'}}];}
    if(query.category){findData.category=query.category.toString();}
    if(query.subCategory){findData.subCategory=query.subCategory.toString();}
    if(query.brand){findData.brand=query.brand.toString();}
    //Get Products
    const products =await this.productModel.find(findData).skip(skip).limit(limit).sort({title:sort}).select(fields).populate('category subCategory brand');
    return {status:200, isEmpty:products.length>0?'false':'true', length:products.length, data:products}
  }

  async findOne(id: string, i18n: I18nContext) :Promise<{status:number,data:Product}>
  {
    let product = await (await this.productModel.findById(id).select('-__v'));
    if(!product){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.PRODUCT')}}));}
    product= await product.populate('category subCategory brand')
    return {status:200, data:product};
  }

  async update(id: string, updateProductDto: UpdateProductDto, i18n: I18nContext) :Promise<{status:number,message:string,data:Product}>
  {
    //Search for Product
    const product = await this.productModel.findById(id);
    if(!product){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.PRODUCT')}}));}
    //Check if Category exists
    const category = await this.categoryModel.findById(updateProductDto.category);
    if(!category){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.CATEGORY')}}));}
    //Check if subCategory exists
    const subCategory = await this.subCategoryModel.findById(updateProductDto.subCategory);
    if(!subCategory){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.SUB_CATEGORY')}}));}
    //Check if Brand exists
    const brand = await this.brandModel.findById(updateProductDto.brand);
    if(!brand){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.BRAND')}}));}
    //check if stock is only decreased
    if(product.stock<updateProductDto.stock){throw new ConflictException(i18n.t('service.STOCK_CANNOT_INCREASED'));}
    //check if priceAfterDiscount is less than price
    const price= product.price || updateProductDto?.price;
    const priceAfterDiscount= product.priceAfterDiscount || updateProductDto?.priceAfterDiscount || 0;
    if(priceAfterDiscount>price){throw new ConflictException(i18n.t('service.AFTER_DIS_CANNOT_GREATER_PRICE'));} 
    //Update Product
    const updatedProduct = await (await this.productModel.findByIdAndUpdate(id,updateProductDto,{new:true}).select('-__v')).populate('category subCategory brand');
    return {status:200,message:i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.PRODUCT')}}),data:updatedProduct};
  }

  async remove(id: string, i18n: I18nContext) :Promise<{status:number,message:string}>
  {
    //Search for Product
    const product = await this.productModel.findById(id);
    if(!product){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.PRODUCT')}}));}
    //Delete Product
    await this.productModel.findByIdAndDelete(id);
    return {status:200,message:i18n.t('service.DELETED_SUCCESSFULLY', {args:{property:i18n.t('service.PRODUCT')}})};
  }
}