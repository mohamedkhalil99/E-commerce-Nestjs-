import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaxDocument = HydratedDocument<Tax>;

@Schema({ timestamps: true })
export class Tax 
{
  @Prop({ required: false,default:0,type:Number})
  tax: number;

  @Prop({ required: false,default:0,type: Number})
  shippingFees: number;
}

export const TaxSchema = SchemaFactory.createForClass(Tax);