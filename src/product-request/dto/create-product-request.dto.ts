import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateProductRequestDto 
{
    @IsNotEmpty({message:i18nValidationMessage('dto.TITLE_NEED_IS_REQUIRED') })
    @IsString({message:i18nValidationMessage('dto.TITLE_NEED_MUST_BE_A_STRING') })
    @MinLength(3, { message:i18nValidationMessage('dto.TITLE_NEED_IS_SHORT') })
    @MaxLength(15, { message:i18nValidationMessage('dto.TITLE_NEED_IS_LONG') })
    titleNeed: string;

    @IsNotEmpty({message:i18nValidationMessage('dto.DETAILS_IS_REQUIRED') })
    @IsString({message:i18nValidationMessage('dto.DETAILS_MUST_BE_A_STRING') })
    @MinLength(5, { message:i18nValidationMessage('dto.DETAILS_IS_SHORT') })
    details:string;

    @IsNotEmpty({message:i18nValidationMessage('dto.QUANTITY_IS_REQUIRED') })
    @IsNumber({},{message:i18nValidationMessage('dto.QUANTITY_MUST_BE_A_NUMBER') })
    @Min(1,{message:i18nValidationMessage('dto.QUANTITY_MIN_IS_1') })
    quantity:number;

    @IsOptional()
    @IsString({message:i18nValidationMessage('dto.CATEGORY_MUST_BE_A_STRING') })
    category:string;
}