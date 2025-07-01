import { IsBoolean, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from "nestjs-i18n";

export class UpdateDeliveryDto
{
    @IsNotEmpty({message:i18nValidationMessage('dto.ISDELIVERD_IS_REQUIRED') })
    @IsBoolean({message:i18nValidationMessage('dto.ISDELIVERD_MUST_BE_A_BOOLEAN') })
    isDeliverd:boolean;
}