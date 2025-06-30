import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateCartDto 
{
    @IsNotEmpty({message:i18nValidationMessage('dto.QUANTITY_IS_REQUIRED') })
    @IsNumber({},{message:i18nValidationMessage('dto.QUANTITY_MUST_BE_A_NUMBER') })
    quantity:number;

    @IsOptional()
    @IsString({message:i18nValidationMessage('dto.COLOR_MUST_BE_A_STRING') })
    color:string;
}