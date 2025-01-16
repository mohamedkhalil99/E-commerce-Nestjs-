import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon 
{
  @Prop({ required: true,type:String ,minlength: 3, maxlength: 20})
  name: string;

  @Prop({required:true, type:Date,min:Date.now()})
  expireDate: Date;

  @Prop({required:true, type:Number})
  discount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);