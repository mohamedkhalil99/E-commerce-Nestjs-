import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateSubCategoryDto 
{
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name is too short' })
    @MaxLength(15, { message: 'Name is too long' })
    name: string;

    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
    category: string;
}