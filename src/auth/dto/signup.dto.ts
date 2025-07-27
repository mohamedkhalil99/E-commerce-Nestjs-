import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, MaxLength, MinLength, ValidateNested } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

class AddressDto 
{
    @IsString()
    name: string;
  
    @IsString()
    addressDetails: string;
  
    @IsString()
    district: string;
  
    @IsString()
    city: string;
}

export class SignUpDto 
{
    @IsNotEmpty({message: i18nValidationMessage('dto.NAME_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.NAME_MUST_BE_A_STRING')})
    @MinLength(3, {message: i18nValidationMessage('dto.NAME_AT_LEAST_3')})
    @MaxLength(30, {message: i18nValidationMessage('dto.NAME_AT_MOST_30')})
    name: string;

    @IsNotEmpty({message: i18nValidationMessage('dto.EMAIL_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.EMAIL_MUST_BE_A_STRING')})
    @IsEmail({}, {message: i18nValidationMessage('dto.INVALID_EMAIL_FORMAT')})
    email: string;

    @IsNotEmpty({message: i18nValidationMessage('dto.PASS_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.PASS_MUST_BE_A_STRING')})
    @MinLength(6, {message: i18nValidationMessage('dto.PASS_AT_LEAST_6')})
    @MaxLength(20, {message: i18nValidationMessage('dto.PASS_AT_MOST_20')})
    password: string;

    @IsNotEmpty({message: i18nValidationMessage('dto.PHONE_NUMBER_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.PHONE_NUMBER_MUST_BE_A_STRING')})
    @IsPhoneNumber('EG',{message: i18nValidationMessage('dto.PHONE_NUMBER_MUST_EG')})
    @Length(11, 11, {message: i18nValidationMessage('dto.PHONE_NUMBER_MUST_BE_11')})
    phoneNumber: string;

    @IsNotEmpty({message: i18nValidationMessage('dto.ADDRESS_IS_REQUIRED')})
    @ValidateNested()
    @IsArray()
    @Type(() => AddressDto)
    address:AddressDto[];
}

export class SignInDto 
{
    @IsNotEmpty({message: i18nValidationMessage('dto.EMAIL_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.EMAIL_MUST_BE_A_STRING')})
    @IsEmail({}, {message: i18nValidationMessage('dto.INVALID_EMAIL_FORMAT')})
    email: string;

    @IsNotEmpty({message: i18nValidationMessage('dto.PASS_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.PASS_MUST_BE_A_STRING')})
    @MinLength(6, {message: i18nValidationMessage('dto.PASS_AT_LEAST_6')})
    @MaxLength(20, {message: i18nValidationMessage('dto.PASS_AT_MOST_20')})
    password: string;
}

export class ForgotPasswordDto
{
    @IsNotEmpty({message: i18nValidationMessage('dto.EMAIL_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.EMAIL_MUST_BE_A_STRING')})
    @IsEmail({}, {message: i18nValidationMessage('dto.INVALID_EMAIL_FORMAT')})
    email: string;
}

export class VerifyResetPasswordCodeDto
{
    @IsNotEmpty({message: i18nValidationMessage('dto.EMAIL_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.EMAIL_MUST_BE_A_STRING')})
    @IsEmail({}, {message: i18nValidationMessage('dto.INVALID_EMAIL_FORMAT')})
    email: string;

    @IsNotEmpty({message: i18nValidationMessage('dto.CODE_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.CODE_MUST_BE_A_STRING')})
    @Length(6, 6, {message: i18nValidationMessage('dto.CODE_MUST_BE_6')})
    code: string;
}

export class NewPasswordDto
{
    @IsNotEmpty({message: i18nValidationMessage('dto.EMAIL_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.EMAIL_MUST_BE_A_STRING')})
    @IsEmail({}, {message: i18nValidationMessage('dto.INVALID_EMAIL_FORMAT')})
    email: string;

    @IsNotEmpty({message: i18nValidationMessage('dto.NEW_PASS_IS_REQUIRED')})
    @IsString({message: i18nValidationMessage('dto.NEW_PASS_MUST_BE_A_STRING')})
    @MinLength(6, {message: i18nValidationMessage('dto.NEW_PASS_AT_LEAST_6')})
    @MaxLength(20, {message: i18nValidationMessage('dto.NEW_PASS_AT_MOST_20')})
    newPassword: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}