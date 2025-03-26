import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, IsUrl, Length, MaxLength, Min, MinLength } from "class-validator";

class AddressDto 
{
    @IsString()
    name: string; 

    @IsString({ message: 'Address must be a string' })
    addressDetails: string;
  
    @IsString()
    district: string;
  
    @IsString()
    city: string;
}

export class CreateUserDto 
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

    @IsString({message: 'Role must be a string'})
    @IsEnum(['admin', 'user'], {message: 'Role must be either admin or user'})
    role: string;

    @IsOptional()
    @IsString({message: 'Avatar must be a string'})
    @IsUrl({}, {message: 'Invalid URL format'})
    avatar: string;

    @IsNotEmpty({message: 'Age is required'})
    @IsNumber({}, {message: 'Age must be a number'})
    @Min(15, {message: 'Age must be at least 15 years old'})
    age: number;

    @IsNotEmpty({message: 'Phone number is required'})
    @IsString({message: 'Phone number must be a string'})
    @IsPhoneNumber('EG',{message:'Phone number must be a valid Egyptian phone number'})
    @Length(11, 11, {message: 'Phone number must be 11 characters'})
    phoneNumber: string;

    @IsNotEmpty({message:'Address is required'})
    @IsArray()
    @Type(()=>AddressDto)
    address: AddressDto[];

    @IsOptional()
    @IsBoolean({message: 'Active must be a boolean'})
    @IsEnum([true, false], {message: 'Active must be either true or false'})
    active: boolean;

    @IsString({message: 'Verification code must be a string'})
    @Length(6, 6, {message: 'Verification code must be 6 characters'})
    verificationCode: string;

    @IsString({message:'Gender must be a string'})
    @IsEnum(['male','female'],{message:'Gender must be either male or female'})
    gender: string;
}