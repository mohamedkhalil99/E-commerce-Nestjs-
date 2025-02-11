import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { User } from 'src/user/user.schema';

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
  
  @Prop({ type: [{ type:mongoose.Schema.Types.ObjectId, ref: User.name }], default: [] })
  usedBy: mongo.ObjectId[];
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);