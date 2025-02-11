import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Coupon } from 'src/coupon/coupon.schema';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true })
export class Cart 
{
  @Prop({required:true, type:[{productId:{type:mongoose.Schema.Types.ObjectId,ref:Product.name},quantity:{type:Number,min:1,default:1},color:{type:String}}] })
  cartItems:[{productId:mongo.ObjectId;quantity:number;color:string;}];

  @Prop({ type:Number })
  totalPrice: number;

  @Prop({ type:Number })
  totalPriceAfterDiscount: number;

  @Prop({ type:[{name:{type:String,minlength: 3, maxlength: 20}},{couponId:{type:mongoose.Schema.Types.ObjectId,ref:Coupon.name}}] })
  coupon:[{name:string;couponId:mongoose.ObjectId;}];

  @Prop({ type:mongoose.Schema.Types.ObjectId,ref:User.name })
  user: mongo.ObjectId;
}

export const CartSchema = SchemaFactory.createForClass(Cart);