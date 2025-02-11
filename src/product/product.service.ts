import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/subCategory.schema';
import { Brand } from 'src/brand/brand.schema';

@Injectable()
export class ProductService 
{
  constructor(@InjectModel(Product.name)private productModel:Model<Product>,
              @InjectModel(Category.name)private categoryModel:Model<Category>,
              @InjectModel(SubCategory.name)private subCategoryModel:Model<SubCategory>,
              @InjectModel(Brand.name)private brandModel:Model<Brand>){}
  
  async create(createProductDto: CreateProductDto) :Promise<{status:number,message:string,data:Product}>
  {
    //Search for Product
    const product = await this.productModel.findOne({title:createProductDto.title});
    if(product){throw new ConflictException('Product already exists');}
    //Check if Category exists
    const category = await this.categoryModel.findById(createProductDto.category);
    if(!category){throw new NotFoundException('Category not found');}
    //Check if subCategory exists
    const subCategory = await this.subCategoryModel.findById(createProductDto.subCategory);
    if(!subCategory){throw new NotFoundException('Sub Category not found');}
    //Check if Brand exists
    const brand = await this.brandModel.findById(createProductDto.brand);
    if(!brand){throw new NotFoundException('Brand not found');} 
    //check if priceAfterDiscount is less than price
    const price= product.price || createProductDto?.price;
    const priceAfterDiscount= product.priceAfterDiscount || createProductDto?.priceAfterDiscount || 0;
    if(priceAfterDiscount>price){throw new ConflictException('Price After Discount cannot be greater than Price');} 
    //Create New Product
    const newProduct = await (await this.productModel.create(createProductDto)).populate('category subCategory brand','-__v');
    return {status:201,message:'Product created successfully',data:newProduct};
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
    return {status:200,isEmpty:products.length>0?'false':'true',length:products.length,data:products}
  }

  async findOne(id: string) :Promise<{status:number,data:Product}>
  {
    let product = await (await this.productModel.findById(id).select('-__v'));
    if(!product){throw new NotFoundException('Product not found');}
    product= await product.populate('category subCategory brand')
    return {status:200,data:product};
  }

  async update(id: string, updateProductDto: UpdateProductDto) :Promise<{status:number,message:string,data:Product}>
  {
    //Search for Product
    const product = await this.productModel.findById(id);
    if(!product){throw new NotFoundException('Product not found');}
    //Check if Category exists
    const category = await this.categoryModel.findById(updateProductDto.category);
    if(!category){throw new NotFoundException('Category not found');}
    //Check if subCategory exists
    const subCategory = await this.subCategoryModel.findById(updateProductDto.subCategory);
    if(!subCategory){throw new NotFoundException('Sub Category not found');}
    //Check if Brand exists
    const brand = await this.brandModel.findById(updateProductDto.brand);
    if(!brand){throw new NotFoundException('Brand not found');} 
    //check if stock is only decreased
    if(product.stock<updateProductDto.stock){throw new ConflictException('Stock cannot be increased');}
    //check if priceAfterDiscount is less than price
    const price= product.price || updateProductDto?.price;
    const priceAfterDiscount= product.priceAfterDiscount || updateProductDto?.priceAfterDiscount || 0;
    if(priceAfterDiscount>price){throw new ConflictException('Price After Discount cannot be greater than Price');} 
    //Update Product
    const updatedProduct = await (await this.productModel.findByIdAndUpdate(id,updateProductDto,{new:true}).select('-__v')).populate('category subCategory brand');
    return {status:200,message:'Product updated successfully',data:updatedProduct};
  }

  async remove(id: string) :Promise<{status:number,message:string}>
  {
    //Search for Product
    const product = await this.productModel.findById(id);
    if(!product){throw new NotFoundException('Product not found');}
    //Delete Product
    await this.productModel.findByIdAndDelete(id);
    return {status:200,message:'Product deleted successfully'};
  }
}