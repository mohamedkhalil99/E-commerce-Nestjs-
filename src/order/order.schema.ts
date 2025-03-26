import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order 
{
  @Prop({required:true,type:mongoose.Schema.Types.ObjectId,ref:User.name})
  user:mongo.ObjectId;

  @Prop({required:true, type:[{productId:{type:mongoose.Schema.Types.ObjectId,ref:Product.name},quantity:{required:true,type:Number,min:1},color:{type:String}}] })
  cartItems:[{productId:mongo.ObjectId;quantity:number;color:string;}];

  @Prop({required:true,default:0,type:Number})
  tax:number;

  @Prop({required:true,default:0,type:Number})
  shippingFees:number;

  @Prop({required:false,default:0,type:Number})
  cashOnDelivery:number;

  @Prop({required:true,default:0,type:Number,min:0})
  orderTotalPrice:number;

  @Prop({required:true,type:String,enum:['cash','card']})
  paymentMethod:string;

  @Prop({required:false,default:false,type:Boolean})
  isPaid:boolean;

  @Prop({required:false,type:Date,})
  paidAt:Date;

  @Prop({required:false,type:Boolean,default:false})
  isDeliverd:boolean;

  @Prop({required:false,type:Date,min:Date.now()})
  deliverdAt:Date;

  @Prop({required:true,type:[{addressDetails:String,district:String,city:String,phone:String}]})
  shippingAddress:[{addressDetails:string,district:string,city:string,phone:string}];
}

export const OrderSchema = SchemaFactory.createForClass(Order);