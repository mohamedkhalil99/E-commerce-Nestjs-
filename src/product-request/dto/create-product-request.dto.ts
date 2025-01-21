import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductRequestDto 
{
    @IsNotEmpty({message:'TitleNeed is required'})
    @IsString({message:'TitleNeed Must be a string'})
    @MinLength(3, { message: 'TitleNeed is too short' })
    @MaxLength(15, { message: 'TitleNeed is too long' })
    titleNeed: string;

    @IsNotEmpty({message:'Details is required'})
    @IsString({message:'Details Must be a string'})
    @MinLength(5, { message: 'Details is too short' })
    details:string;

    @IsNotEmpty({message:'Quantity is required'})
    @IsNumber({},{message:'Quantity Must be a string'})
    @Min(1,{message:'The Minimum Quantity is 1'})
    quantity:number;

    @IsOptional()
    @IsString({message:'Category Must be a string'})
    category:string;
}