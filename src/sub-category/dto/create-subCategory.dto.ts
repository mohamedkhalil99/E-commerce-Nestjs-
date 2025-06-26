import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateSubCategoryDto 
{
    @IsNotEmpty({ message:i18nValidationMessage('dto.NAME_IS_REQUIRED') })
    @IsString({ message:i18nValidationMessage('dto.NAME_MUST_BE_A_STRING') })
    @MinLength(3, { message:i18nValidationMessage('dto.NAME_AT_LEAST_3') })
    @MaxLength(15, { message:i18nValidationMessage('dto.NAME_AT_MOST_15') })
    name: string;

    @IsNotEmpty({ message:i18nValidationMessage('dto.CATEGORY_IS_REQUIRED') })
    @IsString({ message:i18nValidationMessage('dto.CATEGORY_MUST_BE_A_STRING') })
    category: string;
}