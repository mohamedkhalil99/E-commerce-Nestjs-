import { IsNotEmpty, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateSupplierDto 
{
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name is too short' })
    @MaxLength(100, { message: 'Name is too long' })
    name:string;

    @IsNotEmpty({message:'Website is required'})
    @IsUrl({},{message:'The Website Must be a Valid URL'})
    website:string;
}