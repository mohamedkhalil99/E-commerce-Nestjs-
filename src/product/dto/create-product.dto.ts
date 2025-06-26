import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Max, MaxLength, Min, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateProductDto 
{
    @IsNotEmpty({message:i18nValidationMessage('dto.TITLE_IS_REQUIRED') })
    @IsString({message:i18nValidationMessage('dto.TITLE_MUST_BE_A_STRING') })
    @MinLength(3,{message:i18nValidationMessage('dto.TITLE_AT_LEAST_3') })
    @MaxLength(30,{message:i18nValidationMessage('dto.TITLE_AT_MOST_30') })
    title: string;

    @IsNotEmpty({message:i18nValidationMessage('dto.DESCRIPTION_IS_REQUIRED') })
    @IsString({message:i18nValidationMessage('dto.DESCRIPTION_MUST_BE_A_STRING') })
    @MinLength(3,{message:i18nValidationMessage('dto.DESCRIPTION_AT_LEAST_3') })
    description: string;

    @IsNotEmpty({message:i18nValidationMessage('dto.STOCK_IS_REQUIRED') })
    @IsNumber({},{message:i18nValidationMessage('dto.STOCK_MUST_BE_A_NUMBER') })
    @Min(3,{message:i18nValidationMessage('dto.STOCK_AT_LEAST_3') })
    @Max(500,{message:i18nValidationMessage('dto.STOCK_AT_MOST_500') })
    stock: number;

    @IsNotEmpty({message:i18nValidationMessage('dto.COVER_IMG_IS_REQUIRED') })
    @IsUrl({},{message:i18nValidationMessage('dto.COVER_IMG_MUST_BE_A_URL') })
    coverImage: string;

    @IsOptional()
    @IsArray({message:i18nValidationMessage('dto.IMGS_MUST_BE_AN_ARRAY') })
    @IsUrl({},{message:i18nValidationMessage('dto.IMGS_MUST_BE_A_URL') })
    images: string[];

    @IsOptional()
    @IsNumber({},{message:i18nValidationMessage('dto.SOLD_MUST_BE_A_NUMBER') })
    sold: number;

    @IsNotEmpty({message:i18nValidationMessage('dto.PRICE_IS_REQUIRED') })
    @IsNumber({},{message:i18nValidationMessage('dto.PRICE_MUST_BE_A_NUMBER') })
    @Min(1,{message:i18nValidationMessage('dto.PRICE_AT_LEAST_1') })
    price: number;

    @IsOptional()
    @IsNumber({},{message:i18nValidationMessage('dto.AFTER_DIS_MUST_BE_A_NUMBER') })
    @Min(1,{message:i18nValidationMessage('dto.AFTER_DIS_AT_LEAST_1') })
    priceAfterDiscount: number;

    @IsOptional()
    @IsArray({message:i18nValidationMessage('dto.COLORS_MUST_BE_AN_ARRAY') })
    @IsString({each:true,message:i18nValidationMessage('dto.COLORS_MUST_BE_A_STRING') })
    colors: string[];

    @IsNotEmpty({ message:i18nValidationMessage('dto.CATEGORY_IS_REQUIRED') })
    @IsString({ message:i18nValidationMessage('dto.CATEGORY_MUST_BE_A_STRING') })
    @IsMongoId({message:i18nValidationMessage('dto.CATEGORY_MUST_BE_A_MONGO_ID') })
    category: string;

    @IsNotEmpty({ message:i18nValidationMessage('dto.SUB_CATEGORY_IS_REQUIRED') })
    @IsString({ message:i18nValidationMessage('dto.SUB_CATEGORY_MUST_BE_A_STRING') })
    @IsMongoId({message:i18nValidationMessage('dto.SUB_CATEGORY_MUST_BE_A_MONGO_ID') })
    subCategory: string;

    @IsNotEmpty({ message:i18nValidationMessage('dto.BRAND_IS_REQUIRED') })
    @IsString({ message:i18nValidationMessage('dto.BRAND_MUST_BE_A_STRING') })
    @IsMongoId({message:i18nValidationMessage('dto.BRAND_MUST_BE_A_MONGO_ID') })
    brand: string;

    @IsOptional()
    @IsNumber({},{message:i18nValidationMessage('dto.AVG_RATING_MUST_BE_A_NUMBER') })
    averageRating: number;

    @IsOptional()
    @IsNumber({},{message:i18nValidationMessage('dto.RATING_QUN_MUST_BE_A_NUMBER') })
    ratingQuantity: number;
}