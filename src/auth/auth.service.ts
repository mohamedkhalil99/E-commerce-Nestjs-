import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ForgotPasswordDto, NewPasswordDto, SignInDto, SignUpDto, VerifyResetPasswordCodeDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { I18nContext } from 'nestjs-i18n';

//bcrypt salt rounds
const saltRounds = 10;

@Injectable()
export class AuthService 
{
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService, private readonly mailService: MailerService) {}
    
    async signUp(signUpDto: SignUpDto, i18n: I18nContext) : Promise<{status: number, message: string, data: User, accessToken: string, refreshToken: string}>
    {
        //if email exists to avoid duplication
        const ifEmailExists = await this.userModel.findOne({email:signUpDto.email});
        if(ifEmailExists){throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.EMAIL')}}));}
        
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
        `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; max-width: 600px; margin: auto;">
            <h1 style="color: #2c3e50; text-align: center; font-size: 28px; margin-bottom: 10px;">
                Welcome to <span style="color: #007bff;">E-Commerce NestJS</span>
            </h1>
            <p style="text-align: center; font-size: 18px; color: #333;">
                Your account has been created successfully. We're excited to have you onboard!
            </p>
            <hr style="margin: 30px 0;">
            <p style="text-align: center; font-size: 14px; color: #777;">
                — E-Commerce NestJS Team
            </p>
        </div>`
        
        await this.mailService.sendMail
        ({
            from: `E-Commerce-Nestjs <${process.env.EMAIL_USERNAME}>`,
            to:newUser.email,
            subject: 'E-Commerce-Nestjs | Welcome',
            html: htmllmsg,
        });
        
        return {status: 201, message: i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.USER')}}), data: newUser, accessToken, refreshToken};
    }
    
    async signIn(signInDto: SignInDto, i18n: I18nContext) : Promise<{data: User, accessToken: string, refreshToken: string}>
    {
        //find the email
        const ifEmailExists = await this.userModel.findOne({email:signInDto.email}).select('name email role password');
        if(!ifEmailExists){throw new ConflictException(i18n.t('service.WRONG_EMAIL_OR_PASS'));}
        
        //compare password with hashed one
        const hashedPassword = ifEmailExists.password;
        const isMatch = await bcrypt.compare(signInDto.password, hashedPassword);
        if(!isMatch){throw new ConflictException(i18n.t('service.WRONG_EMAIL_OR_PASS'));}
        
        //create access token by payload
        const payload={email: ifEmailExists.email, role: ifEmailExists.role, id: ifEmailExists._id};
        const accessToken= await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET,});

        //create refresh token
        const refreshToken = await this.jwtService.signAsync({...payload, countEX:5}, {secret: process.env.JWT_REFRESH_KEY, expiresIn: '7d'});
        
        return {data: ifEmailExists, accessToken, refreshToken};
    }
    
    async forgotPassword(emailDto: ForgotPasswordDto, i18n: I18nContext) : Promise<{status: number, message: string}>
    {
        //find the email
        const ifEmailExists = await this.userModel.findOne({email:emailDto.email});
        if(!ifEmailExists){throw new ConflictException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.EMAIL')}}));}
        
        //create 6 digit Code
        //const code = math.floor(math.random()*1000000).toString().padStart(6, '0');
        const code = Math.floor(100000 + Math.random() * 900000);
        
        //hash the code
        const hashedCode = await bcrypt.hash(code.toString(), saltRounds);

        //Put the code in the Verification Code field in the database
        await this.userModel.findOneAndUpdate({email:emailDto.email},{verificationCode:hashedCode});
        
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
            to:emailDto.email,
            subject: 'E-Commerce-Nestjs | Reset Password',
            html: htmllmsg,
        });
        return {status: 201, message:i18n.t('service.verification_code_sent', {args: { email: emailDto.email }})};//`Verification code sent to your email ${email.email}`
    }
    
    async verifyResetPasswordCode(dto: VerifyResetPasswordCodeDto, i18n: I18nContext): Promise<{ status: number; message: string }> {
        //Check if the user exists
        const user = await this.userModel.findOne({ email: dto.email }).select('email verificationCode');
        if (!user || !user.verificationCode) {throw new ConflictException(i18n.t('service.INVALID', { args: { property: i18n.t('service.CODE') } }));}

        // Compare the provided code with the hashed code in the database
        const isMatch = await bcrypt.compare(dto.code, user.verificationCode);
        if (!isMatch) {throw new ConflictException(i18n.t('service.INVALID', { args: { property: i18n.t('service.CODE') } }));}

        // If the code matches, clear the verificationCode field
        await this.userModel.findOneAndUpdate({ email: dto.email }, { verificationCode: null });

        return {status: 200, message: i18n.t('service.CODE_VERIFIED'),};
    }

    async newPassword(dto:NewPasswordDto, i18n: I18nContext) : Promise<{status: number, message: string}>
    {
        //find the email
        const ifEmailExists = await this.userModel.findOne({email:dto.email});
        if(!ifEmailExists){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.EMAIL')}}));}
        
        //hash the new password
        const newPassword = await bcrypt.hash(dto.newPassword, saltRounds);
        await this.userModel.findOneAndUpdate({email:dto.email},{password:newPassword});
        return {status: 200, message: i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.PASSWORD')}})};
    }

    async refreshToken(refreshToken: string, i18n: I18nContext): Promise<{ status: number; message: string; accessToken: string; refreshToken: string }> {
        let payload;
        try {payload = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_REFRESH_KEY});} 
        catch {throw new ConflictException(i18n.t('service.REFRESH_TOKEN_EXP_OR_INVALID'));}

        if (!payload || payload.countEX <= 0) {throw new ConflictException(i18n.t('service.INVALID_REFRESH_TOKEN'));}

        // Check if user ID is present in the payload
        let userId = payload.id;
        if (!userId) {
            const user = await this.userModel.findOne({ email: payload.email });
            if (!user) {throw new ConflictException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.USER')}}));}
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

        return { status: 200, message: i18n.t('service.TOKEN_REFRESHED_SUCCESS'), accessToken, refreshToken: newRefreshToken};
    }
}