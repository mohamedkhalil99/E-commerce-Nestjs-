import { IsDateString, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateCouponDto 
{
    @IsNotEmpty({ message:i18nValidationMessage('dto.NAME_IS_REQUIRED')})
    @IsString({ message:i18nValidationMessage('dto.NAME_MUST_BE_A_STRING')})
    @MinLength(3, { message:i18nValidationMessage('dto.NAME_AT_LEAST_3')})
    @MaxLength(20, { message:i18nValidationMessage('dto.NAME_AT_MOST_20')})
    name:string;

    @IsNotEmpty({message:i18nValidationMessage('dto.COUPON_EXP_IS_REQUIRED') })
    @IsDateString({},{message:i18nValidationMessage('dto.COUPON_EXP_MUST_BE_A_VALID_DATE') })
    expireDate: Date;

    @IsNotEmpty({message:i18nValidationMessage('dto.COUPON_DIS_IS_REQUIRED') })
    @IsNumber({}, {message:i18nValidationMessage('dto.COUPON_DIS_MUST_BE_A_NUMBER') })
    @Min(1, {message:i18nValidationMessage('dto.COUPON_DIS_AT_LEAST_1') })
    discount: number;
}