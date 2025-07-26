import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ForgotPasswordDto, NewPasswordDto, SignInDto, SignUpDto, VerifyResetPasswordCodeDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

//bcrypt salt rounds
const saltRounds = 10;

@Injectable()
export class AuthService 
{
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService, private readonly mailService: MailerService) {}
    
    async signUp(signUpDto: SignUpDto) : Promise<{status: number, message: string, data: User, accessToken: string, refreshToken: string}>
    {
        //if email exists to avoid duplication
        const ifEmailExists = await this.userModel.findOne({email:signUpDto.email});
        if(ifEmailExists){throw new ConflictException('Email already exists');}
        
        //create user and hash password
        const password = await bcrypt.hash(signUpDto.password, saltRounds);
        
        const user={password, role:'user', active:true};
        const newUser =(await this.userModel.create({...signUpDto,...user}));

        //create access token by payload
        const payload= {email:newUser.email, role:newUser.role,};
        const accessToken= await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET,});
        
        //create refresh token
        const refreshToken = await this.jwtService.signAsync({...payload, countEX:5}, {secret: process.env.JWT_REFRESH_KEY, expiresIn: '7d'});
        
        //Send welcome email
        const htmllmsg=
        `<div>
        <h1 style="font-weight:bold; text-align:center"> Welcome to E-Commerce-Nestjs </h1>
        <p style="font-weight:bold; text-align:center"> Your account has been created successfully </p>
        <h4 style="font-weight:bold;"> E-Commerce-Nestjs </h4>  
        </div>`;
        
        await this.mailService.sendMail
        ({
            from: `E-Commerce-Nestjs <${process.env.EMAIL_USERNAME}>`,
            to:newUser.email,
            subject: 'E-Commerce-Nestjs | Welcome',
            html: htmllmsg,
        });
        
        return {status: 201, message: 'User created successfully', data: newUser, accessToken, refreshToken};
    }
    
    async signIn(signInDto: SignInDto) : Promise<{data: User, accessToken: string, refreshToken: string}>
    {
        //find the email
        const ifEmailExists = await this.userModel.findOne({email:signInDto.email}).select('name email role password');
        if(!ifEmailExists){throw new ConflictException('Wrong Email Or Password');}
        
        //compare password with hashed one
        const hashedPassword = ifEmailExists.password;
        const isMatch = await bcrypt.compare(signInDto.password, hashedPassword);
        if(!isMatch){throw new ConflictException('Wrong Email Or Password');}
        
        //create access token by payload
        const payload={email: ifEmailExists.email, role: ifEmailExists.role, id: ifEmailExists._id};
        const accessToken= await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET,});

        //create refresh token
        const refreshToken = await this.jwtService.signAsync({...payload, countEX:5}, {secret: process.env.JWT_REFRESH_KEY, expiresIn: '7d'});
        
        return {data: ifEmailExists, accessToken, refreshToken};
    }
    
    async forgotPassword(email: ForgotPasswordDto) : Promise<{status: number, message: string}>
    {
        //find the email
        const ifEmailExists = await this.userModel.findOne({email:email.email});
        if(!ifEmailExists){throw new ConflictException('Email does not exist');}
        
        //create 6 digit Code
        //const code = math.floor(math.random()*1000000).toString().padStart(6, '0');
        const code = Math.floor(100000 + Math.random() * 900000);
        
        //Put the code in the Verification Code field in the database
        await this.userModel.findOneAndUpdate({email:email.email},{verificationCode:code});
        
        //Send the code to the email
        const htmllmsg=
        `<div>
        <h1 style="font-weight:bold; text-align:center"> Your verification code is </h1>
        <p><h2 style="color: green; font-weight:bold; text-align:center"> ${code} </h2></p>
        <h4 style="font-weight:bold;"> E-Commerce-Nestjs </h4>
        </div>`;
        
        await this.mailService.sendMail
        ({
            from: `E-Commerce-Nestjs <${process.env.EMAIL_USERNAME}>`,
            to:email.email,
            subject: 'E-Commerce-Nestjs | Reset Password',
            html: htmllmsg,
        });
        return {status: 201, message: `Verification code sent to your email ${email.email}`};
    }
    
    async verifyResetPasswordCode(dto:VerifyResetPasswordCodeDto): Promise<{status: number, message: string}> 
    {
        //find the code
        const ifCodeExists = await this.userModel.findOne({email: dto.email,verificationCode: dto.code}).select('email verificationCode');
        if(!ifCodeExists){throw new ConflictException('Invalid code');}
        await this.userModel.findOneAndUpdate({email:dto.email},{verificationCode:null});
        return {status: 200 , message: 'Code verified successfully'};
    }
    
    async newPassword(dto:NewPasswordDto) : Promise<{status: number, message: string}>
    {
        //find the email
        const ifEmailExists = await this.userModel.findOne({email:dto.email});
        if(!ifEmailExists){throw new NotFoundException('Email does not exist');}
        
        //hash the new password
        const newPassword = await bcrypt.hash(dto.newPassword, saltRounds);
        await this.userModel.findOneAndUpdate({email:dto.email},{password:newPassword});
        return {status: 200, message: 'Password updated successfully'};
    }

    async refreshToken(refreshToken: string): Promise<{ status: number; message: string; accessToken: string; refreshToken: string }> {
        let payload;
        try {payload = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_REFRESH_KEY});} 
        catch {throw new ConflictException('Refresh token expired or invalid');}

        if (!payload || payload.countEX <= 0) {throw new ConflictException('Invalid refresh token, Sign In Again!');}

        // Check if user ID is present in the payload
        let userId = payload.id;
        if (!userId) {
            const user = await this.userModel.findOne({ email: payload.email });
            if (!user) {throw new ConflictException('User not found');}
            userId = user._id.toString();
        }

        const accessToken = await this.jwtService.signAsync(
            {id: userId, email: payload.email, role: payload.role},
            {secret: process.env.JWT_SECRET}
        );

        const newRefreshToken = await this.jwtService.signAsync(
            {id: userId, email: payload.email, role: payload.role, countEX: payload.countEX - 1},
            {secret: process.env.JWT_REFRESH_KEY, expiresIn: '7d'}
        );

        return { status: 200, message: 'Token refreshed successfully', accessToken, refreshToken: newRefreshToken };
    }
}