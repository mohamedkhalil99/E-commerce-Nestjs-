import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { Category } from 'src/category/category.schema';

export type SubCategoryDocument = HydratedDocument<SubCategory>;

@Schema({ timestamps: true })
export class SubCategory 
{
  @Prop({ required: true,type:String ,minlength: 3, maxlength: 15})
  name: string;

  @Prop({required:true, type:mongoose.Schema.Types.ObjectId,ref:Category.name})
  category: mongo.ObjectId;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);