import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User 
{
  @Prop({ required: true,type:String ,minlength: 3, maxlength: 30})
  name: string;

  @Prop({required: true, type: String,unique:true})
  email: string;

  @Prop({required: true, type: String})
  password: string;

  @Prop({required: true, type: String, enum: ['admin', 'user'],/* default: 'user'*/})
  role: string;

  @Prop({Optional: true, type: String})
  avatar: string;

  @Prop({required: true, type: Number})
  age: number;

  @Prop({required: true, type: String,phoneLocale:'EG',phonenumber:true,length:11})
  phoneNumber:string;

  @Prop({Optional: true, type: String})
  address: string;

  @Prop({type: Boolean, enum: [true, false]})
  active: boolean;

  @Prop({type: String})
  verificationCode: string;

  @Prop({type: String,enum:['male','female']})
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);