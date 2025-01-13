import { ConflictException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

//bcrypt salt rounds
const saltRounds = 10;
@Injectable()
export class AuthService 
{
    constructor(@InjectModel(User.name) private userModel: Model<User>,private jwtService: JwtService) {}
    
    async signUp(signUpDto: SignUpDto) : Promise<{status: number, message: string, data: User, token: string}>
    {
        //if email exists to avoid duplication
        const ifEmailExists = await this.userModel.findOne({email:signUpDto.email});
        if(ifEmailExists){throw new ConflictException('Email already exists');}

        //create user and hash password
        const password = await bcrypt.hash(signUpDto.password, saltRounds);
        
        const user={password, role:'user', active:true};
        const newUser =(await this.userModel.create({...signUpDto,...user}));

        //create token by payload
        const payload={email:newUser.email,role:newUser.role,};
        const token=await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET,});

        return {status:201,message:'User created successfully',data:newUser,token};
    }

    async signIn(signInDto: SignInDto) : Promise<{data: User, token: string}>
    {
        //find the email
        const ifEmailExists = await this.userModel.findOne({email:signInDto.email}).select('name email role password');
        if(!ifEmailExists){throw new ConflictException('Wrong Email Or Password');}

        //compare password with hashed one
        const hashedPassword = ifEmailExists.password;
        const isMatch = await bcrypt.compare(signInDto.password, hashedPassword);
        if(!isMatch){throw new ConflictException('Wrong Email Or Password');}

        //create token by payload
        const payload={email:ifEmailExists.email,role:ifEmailExists.role,};
        const token= await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET,});
        return {data:ifEmailExists,token};
    }
}
