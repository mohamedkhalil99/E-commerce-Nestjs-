import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review 
{
  @Prop({ required: false,type:String ,minlength: 3, maxlength: 100})
  reviewText: string;

  @Prop({required:true,type:Number,min:1,max:5})
  rating:number;

  @Prop({required:true,type:mongoose.Schema.Types.ObjectId,ref:User.name})
  user:mongo.ObjectId;

  @Prop({required:true,type:mongoose.Schema.Types.ObjectId,ref:Product.name})
  product:mongo.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);