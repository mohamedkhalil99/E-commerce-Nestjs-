import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateReviewDto 
{
    @IsOptional()
    @IsString({message:'Review text must be a string'})
    @MinLength(3,{message:'Review text must be at least 3 characters'})
    @MaxLength(100,{message:'Review text must be at most 100 characters'})
    reviewText:string;

    @IsNotEmpty({message:'Rating is required'})
    @IsNumber({},{message:'Rating must be a number'})
    @Min(1,{message:'Rating must be at least 1 star'})
    @Max(5,{message:'Rating must be at most 5 star'})
    rating:number;

    @IsNotEmpty({message:'Product is required'})
    @IsString({message:'Product Must be a string'})
    @IsMongoId({message:'Product must be a valid mongo id'})
    product:string;
}