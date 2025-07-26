import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

class AddressDto 
{
    @IsString()
    name: string;
  
    @IsString()
    addressDetails: string;
  
    @IsString()
    district: string;
  
    @IsString()
    city: string;
}

export class SignUpDto 
{
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    @MinLength(3, {message: 'Name must be at least 3 characters'})
    @MaxLength(30, {message: 'Name must be at most 30 characters'})
    name: string;

    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsString({message: 'Password must be a string'})
    @MinLength(6, {message: 'Password must be at least 6 characters'})
    @MaxLength(20, {message: 'Password must be at most 20 characters'})
    password: string;

    @IsNotEmpty({message: 'Phone Number is required'})
    @IsString({message:'Phone Number must be a string'})
    phoneNumber:string;

    @IsNotEmpty({message: 'Address is required'})
    @ValidateNested()
    @IsArray()
    @Type(() => AddressDto)
    address:AddressDto[];
}

export class SignInDto 
{
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsString({message: 'Password must be a string'})
    @MinLength(6, {message: 'Password must be at least 6 characters'})
    @MaxLength(20, {message: 'Password must be at most 20 characters'})
    password: string;
}

export class ForgotPasswordDto
{
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;
}

export class VerifyResetPasswordCodeDto
{
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;

    @IsNotEmpty({message: 'Code is required'})
    @IsString({message: 'Code must be a string'})
    code: string;
}

export class NewPasswordDto
{
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @IsEmail({}, {message: 'Invalid email format'})
    email: string;

    @IsNotEmpty({message: 'New Password is required'})
    @IsString({message: 'New Password must be a string'})
    @MinLength(6, {message: 'New Password must be at least 6 characters'})
    @MaxLength(20, {message: 'New Password must be at most 20 characters'})
    newPassword: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}