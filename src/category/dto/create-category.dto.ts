import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto 
{
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name is too short' })
    @MaxLength(15, { message: 'Name is too long' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Image must be a string' })
    @IsUrl({}, { message: 'Image must be a URL' })
    image: string;
}