import { IsNumber, IsOptional } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateTaxDto 
{
    @IsOptional()
    @IsNumber({},{message:i18nValidationMessage('dto.TAX_MUST_BE_A_NUMBER')})
    tax:number;

    @IsOptional()
    @IsNumber({},{message:i18nValidationMessage('dto.SHIPPING_FEES_MUST_BE_A_NUMBER')})

    @IsOptional()
    @IsNumber({},{message:i18nValidationMessage('dto.COD_FEE_MUST_BE_A_NUMBER')})
    cashOnDelivery:number;
}