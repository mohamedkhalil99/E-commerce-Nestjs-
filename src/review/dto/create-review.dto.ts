import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateReviewDto 
{
    @IsOptional()
    @IsString({message:i18nValidationMessage('dto.REVIEW_TEXT_MUST_BE_A_STRING') })
    @MinLength(3,{message:i18nValidationMessage('dto.REVIEW_TEXT_AT_LEAST_3') })
    @MaxLength(100,{message:i18nValidationMessage('dto.REVIEW_TEXT_AT_MOST_100') })
    reviewText:string;

    @IsNotEmpty({message:i18nValidationMessage('dto.RATING_IS_REQUIRED') })
    @IsNumber({},{message:i18nValidationMessage('dto.RATING_MUST_BE_A_NUMBER') })
    @Min(1,{message:i18nValidationMessage('dto.RATING_AT_LEAST_1') })
    @Max(5,{message:i18nValidationMessage('dto.RATING_AT_MOST_5') })
    rating:number;

    @IsNotEmpty({message:i18nValidationMessage('dto.PRODUCT_IS_REQUIRED') })
    @IsString({message:i18nValidationMessage('dto.PRODUCT_MUST_BE_A_STRING') })
    @IsMongoId({message:i18nValidationMessage('dto.PRODUCT_MUST_BE_A_MONGO_ID') })
    product:string;
}