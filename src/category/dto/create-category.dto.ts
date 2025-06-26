import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateCategoryDto 
{
    @IsNotEmpty({ message:i18nValidationMessage('dto.NAME_IS_REQUIRED') })
    @IsString({ message:i18nValidationMessage('dto.NAME_MUST_BE_A_STRING') })
    @MinLength(3, { message:i18nValidationMessage('dto.NAME_AT_LEAST_3') })
    @MaxLength(15, { message:i18nValidationMessage('dto.NAME_AT_MOST_15') })
    name: string;

    @IsOptional()
    @IsString({ message:i18nValidationMessage('dto.IMAGE_MUST_BE_A_STRING') })
    @IsUrl({}, { message:i18nValidationMessage('dto.IMAGE_MUST_BE_A_URL') })
    image: string;
}