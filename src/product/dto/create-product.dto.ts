import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto 
{
    @IsNotEmpty({message:'Title is required'})
    @IsString({message:'Title must be a string'})
    @MinLength(3,{message:'Title is too short'})
    @MaxLength(30,{message:'Title is too long'})
    title: string;

    @IsNotEmpty({message:'Description is required'})
    @IsString({message:'Description must be a string'})
    @MinLength(3,{message:'Description is too short'})
    description: string;

    @IsNotEmpty({message:'Stock is required'})
    @IsNumber({},{message:'Stock must be a number'})
    @Min(3,{message:'Stock must be at least 3'})
    @Max(500,{message:'Stock must be at most 500'})
    stock: number;

    @IsNotEmpty({message:'Cover Image is required'})
    @IsUrl({},{message:'Cover Image must be a valid URL'})
    coverImage: string;

    @IsOptional()
    @IsArray({message:'Images must be an Array'})
    @IsUrl({},{message:'Images must be a valid URL'})
    images: string[];

    @IsOptional()
    @IsNumber({},{message:'Sold must be a number'})
    sold: number;

    @IsNotEmpty({message:'Price is required'})
    @IsNumber({},{message:'Price must be a number'})
    @Min(1,{message:'Price must be at least 1'})
    price: number;

    @IsOptional()
    @IsNumber({},{message:'Price After Discount must be a number'})
    @Min(1,{message:'Price After Discount must be at least 1'})
    priceAfterDiscount: number;

    @IsOptional()
    @IsArray({message:'Colors must be an Array'})
    @IsString({each:true,message:'Colors must be a string'})
    colors: string[];

    @IsNotEmpty({ message: 'Category is required' })
    @IsString({ message: 'Category must be a string' })
    @IsMongoId({message:'Category must be a Mongo ID'})
    category: string;

    @IsNotEmpty({ message: 'Sub Category is required' })
    @IsString({ message: 'Sub Category must be a string' })
    @IsMongoId({message:'Sub Category must be a Mongo ID'})
    subCategory: string;

    @IsNotEmpty({ message: 'Brand is required' })
    @IsString({ message: 'Brand must be a string' })
    @IsMongoId({message:'Brand must be a Mongo ID'})
    brand: string;

    @IsOptional()
    @IsNumber({},{message:'Average Rating must be a number'})
    averageRating: number;

    @IsOptional()
    @IsNumber({},{message:'Rating Quantity must be a number'})
    ratingQuantity: number;
}