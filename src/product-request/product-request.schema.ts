import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { User } from 'src/user/user.schema';

export type ProductRequestDocument = HydratedDocument<ProductRequest>;

@Schema({ timestamps: true })
export class ProductRequest 
{
  @Prop({ required: true,type:String ,minlength: 3, maxlength: 100})
  titleNeed: string;

  @Prop({required:true,type:String,minlength:5})
  details:string;

  @Prop({required:true,type:Number,min:1})
  quantity:number;

  @Prop({required:false,type:String})
  category:string;

  @Prop({required:false,type:mongoose.Schema.Types.ObjectId,ref:User.name})
  user:mongo.ObjectId;
}

export const ProductRequestSchema = SchemaFactory.createForClass(ProductRequest);