import { ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { I18nContext } from 'nestjs-i18n';

//bcrypt salt rounds
const saltRounds = 10;
@Injectable()
export class UserService 
{
  constructor(@InjectModel(User.name)private userModel:Model<User>){}
  
  async create(createUserDto: CreateUserDto, i18n: I18nContext):Promise<{status: number, message: string, data: User}>
  {
    //if email exists to avoid duplication
    const ifUserExists = await this.userModel.findOne({email:createUserDto.email});
    if(ifUserExists){throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.USER')}} ));}

    //create user and hash password
    const password = await bcrypt.hash(createUserDto.password, saltRounds);
    const user={password,role:createUserDto.role??'user',active:true};
    return{status:201, message:i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.USER')}}), data:await this.userModel.create({...createUserDto,...user})};
  }
  
  async findAll(query, i18n: I18nContext):Promise<{status: number, length: number, data: User[]}>
  {
    const {limit=1000_000_000,skip=0,sort='asc',name,email,role} = query;
    if(Number.isNaN(+limit)){throw new ConflictException(i18n.t('service.INVALID_LIMIT_QUERY_PARAMETERS'));}
    if(Number.isNaN(+skip)){throw new ConflictException(i18n.t('service.INVALID_SKIP_QUERY_PARAMETERS'));}
    if(!['asc','desc'].includes(sort)){throw new ConflictException(i18n.t('service.INVALID_SORT_QUERY_PARAMETERS'));}
    const users = await this.userModel.find().skip(skip).limit(limit).where('name',new RegExp(name,'i')).where('email',new RegExp(email,'i')).where('role',new RegExp(role,'i')).sort({name:sort}).select('-password -__v');
    return { status:200,length:users.length,data:users};
  }

  async findOne(id: string, i18n: I18nContext):Promise<{status: number, data: User}>
  {
    const user = await this.userModel.findById(id).select('-password -__v');
    if(!user){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.USER')}}) );}
    return {status:200,data:user};
  }

  async update(id: string, updateUserDto: UpdateUserDto, i18n: I18nContext):Promise<{status: number, message: string, data: User}>
  {
    //if user exists
    const ifUserExists = await this.userModel.findById(id).select('-password -__v');
    if(!ifUserExists){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.USER')}}) );}
    //update user
    let user = {...updateUserDto};
    if(updateUserDto.password){const password = await bcrypt.hash(updateUserDto.password, saltRounds);user={...user,password};}
    return {status:200, message:i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.USER')}}), data:await this.userModel.findByIdAndUpdate(id,user, {new:true}).select('-password -__v')};
  }

  async remove(id: string, i18n: I18nContext):Promise<{status: number, message: string}>
  {
    const user = await this.userModel.findByIdAndDelete(id);
    if(!user){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.USER')}}) );}
    return {status:200, message:i18n.t('service.DELETED_SUCCESSFULLY', {args:{property:i18n.t('service.USER')}}) };
  }

  //For User
  async getProfile(payload, i18n: I18nContext):Promise<{status: number, data: User}>
  {
    if(!payload.id){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.USER')}}) );}
    const user = await this.userModel.findById(payload.id).select('-password -__v');
    if(!user){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.USER')}}) );}
    return {status:200,data:user};
  }

  async unActiveProfile(payload, i18n: I18nContext):Promise<{status: number, message: string}>
  {
    if(!payload.id){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.USER')}}) );}
    const user = await this.userModel.findById(payload.id).select('-password -__v');
    if(!user){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.USER')}}) );}
    if(!user.active){throw new ConflictException(i18n.t('service.ALREADY_UNACTIVATED', {args:{property:i18n.t('service.USER')}}));}
    await this.userModel.findByIdAndUpdate(payload.id,{active:false},{new:true}).select('-password -__v')
    return {status:200,message:i18n.t('service.UNACTIVATED_SUCCESSFULLY', {args:{property:i18n.t('service.USER')}}) };
  }
}