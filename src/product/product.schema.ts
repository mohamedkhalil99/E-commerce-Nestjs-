import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Brand } from 'src/brand/brand.schema';
import { Category } from 'src/category/category.schema';
import { SubCategory } from 'src/sub-category/subCategory.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product 
{
  @Prop({ required: true,type:String ,minlength: 3, maxlength: 30})
  title: string;

  @Prop({required:true, type:String,minlength:20})
  description: string;

  @Prop({required:true, type:Number,min:1,max:500,default:1})
  stock: number;

  @Prop({required:true, type:String})
  coverImage: string;

  @Prop({required:false, type:Array})
  images: string[];

  @Prop({required:false, type:Number,default:0})
  sold: number;

  @Prop({required:true, type:Number,min:1})
  price: number;

  @Prop({required:false, type:Number,default:0})
  priceAfterDiscount: number;

  @Prop({required:false, type:Array})
  colors: string[];

  @Prop({required:true, type:mongoose.Schema.Types.ObjectId,ref:Category.name})
  category: mongo.ObjectId;

  @Prop({required:true, type:mongoose.Schema.Types.ObjectId,ref:SubCategory.name})
  subCategory: mongo.ObjectId;

  @Prop({required:true, type:mongoose.Schema.Types.ObjectId,ref:Brand.name})
  brand: mongo.ObjectId;

  @Prop({required:false, type:Number,default:0})
  averageRating: number;

  @Prop({required:true, type:Number,default:0})
  ratingQuantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);