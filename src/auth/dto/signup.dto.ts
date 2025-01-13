import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

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