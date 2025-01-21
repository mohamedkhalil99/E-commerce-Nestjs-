import { ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

//bcrypt salt rounds
const saltRounds = 10;
@Injectable()
export class UserService 
{
  constructor(@InjectModel(User.name)private userModel:Model<User>){}
  
  async create(createUserDto: CreateUserDto):Promise<{status: number, message: string, data: User}>
  {
    //if email exists to avoid duplication
    const ifUserExists = await this.userModel.findOne({email:createUserDto.email});
    if(ifUserExists){throw new ConflictException('Email already exists');}

    //create user and hash password
    const password = await bcrypt.hash(createUserDto.password, saltRounds);
    const user={password,role:createUserDto.role??'user',active:true};
    return{status:201,message:'User created successfully',data:await this.userModel.create({...createUserDto,...user})};
  }
  
  async findAll(query):Promise<{status: number, length: number, data: User[]}>
  {
    const {limit=1000_000_000,skip=0,sort='asc',name,email,role} = query;
    if(Number.isNaN(+limit)){throw new ConflictException('Invalid Limit query parameters');}
    if(Number.isNaN(+skip)){throw new ConflictException('Invalid Skip query parameters');}
    if(!['asc','desc'].includes(sort)){throw new ConflictException('Invalid Sort query parameters');}
    const users = await this.userModel.find().skip(skip).limit(limit).where('name',new RegExp(name,'i')).where('email',new RegExp(email,'i')).where('role',new RegExp(role,'i')).sort({name:sort}).select('-password -__v');
    return { status:200,length:users.length,data:users};
  }

  async findOne(id: string):Promise<{status: number, data: User}>
  {
    const user = await this.userModel.findById(id).select('-password -__v');
    if(!user){throw new NotFoundException('User not found');}
    return {status:200,data:user};
  }

  async update(id: string, updateUserDto: UpdateUserDto):Promise<{status: number, message: string, data: User}>
  {
    //if user exists
    const ifUserExists = await this.userModel.findById(id).select('-password -__v') //findOne({email:updateUserDto.email});
    if(!ifUserExists){throw new NotFoundException('User not found');}
    //update user
    let user = {...updateUserDto};
    if(updateUserDto.password){const password = await bcrypt.hash(updateUserDto.password, saltRounds);user={...user,password};}
    return {status:200,message:'User updated successfully',data:await this.userModel.findByIdAndUpdate(id,user,{new:true}).select('-password -__v')};
  }

  async remove(id: string):Promise<{status: number, message: string}>
  {
    const user = await this.userModel.findByIdAndDelete(id);
    if(!user){throw new NotFoundException();}
    return {status:200,message:'User deleted successfully'};
  }

  //For User
  async getProfile(payload):Promise<{status: number, data: User}>
  {
    if(!payload.id){throw new NotFoundException('User not found');}
    const user = await this.userModel.findById(payload.id).select('-password -__v');
    if(!user){throw new NotFoundException('User not found');}
    return {status:200,data:user};
  }

  async unActiveProfile(payload):Promise<{status: number, message: string}>
  {
    if(!payload.id){throw new NotFoundException('User not found');}
    const user = await this.userModel.findById(payload.id).select('-password -__v');
    if(!user){throw new NotFoundException('User not found');}
    if(!user.active){throw new ConflictException('User already unactivated');}
    await this.userModel.findByIdAndUpdate(payload.id,{active:false},{new:true}).select('-password -__v')
    return {status:200,message:'User Unactivated successfully'};
  }
}