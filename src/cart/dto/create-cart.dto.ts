import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCartDto 
{
    @IsNotEmpty({message:'Quantity is required'})
    @IsNumber({},{message:'Quantity must be a number'})
    quantity:number;

    @IsOptional()
    @IsString({message:'Color must be a string'})
    color:string;
}