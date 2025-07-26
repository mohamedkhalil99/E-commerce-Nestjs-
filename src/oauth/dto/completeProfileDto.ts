import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl, Length, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from "nestjs-i18n";

class AddressDto 
{
    @IsString()
    name: string; 

    @IsString({ message:i18nValidationMessage('dto.ADDRESS_MUST_BE_A_STRING') })
    addressDetails: string;
  
    @IsString()
    district: string;
  
    @IsString()
    city: string;
}

class TempUserDto {
    @IsNotEmpty({message:i18nValidationMessage('dto.NAME_IS_REQUIRED') })
    @IsString({message:i18nValidationMessage('dto.NAME_MUST_BE_A_STRING') })
    @MinLength(3, {message:i18nValidationMessage('dto.NAME_AT_LEAST_3') })
    @MaxLength(30, {message:i18nValidationMessage('dto.NAME_AT_MOST_30') })
    name: string;

    @IsNotEmpty({message:i18nValidationMessage('dto.EMAIL_IS_REQUIRED') })
    @IsString({message:i18nValidationMessage('dto.EMAIL_MUST_BE_A_STRING') })
    @IsEmail({}, {message:i18nValidationMessage('dto.INVALID_EMAIL_FORMAT') })
    email: string;

    @IsNotEmpty({message:i18nValidationMessage('dto.PASS_IS_REQUIRED') })
    @IsString({message:i18nValidationMessage('dto.PASS_MUST_BE_A_STRING') })
    @MinLength(6, {message:i18nValidationMessage('dto.PASS_AT_LEAST_6') })
    @MaxLength(20, {message:i18nValidationMessage('dto.PASS_AT_MOST_20') })
    password: string;

    @IsString({message:i18nValidationMessage('dto.ROLE_MUST_BE_A_STRING') })
    role: string;

    @IsOptional()
    @IsString({message:i18nValidationMessage('dto.AVATAR_MUST_BE_A_STRING') })
    @IsUrl({}, {message:i18nValidationMessage('dto.INVALID_URL_FORMAT') })
    avatar: string;

    @IsOptional()
    @IsBoolean({message:i18nValidationMessage('dto.ACTIVE_MUST_BE_A_BOOLEAN') })
    @IsEnum([true, false], {message:i18nValidationMessage('dto.ACTIVE_TRUE_OR_FALSE') })
    active: boolean;

    @IsNotEmpty({ message:i18nValidationMessage('dto._id_IS_REQUIRED') })
    @IsString({ message:i18nValidationMessage('dto._id_MUST_BE_A_STRING') })
    @IsMongoId({message:i18nValidationMessage('dto._id_MUST_BE_A_MONGO_ID') })
    _id: string;

    @IsNotEmpty({message:i18nValidationMessage('dto.ADDRESS_IS_REQUIRED') })
    @IsArray()
    @Type(()=>AddressDto)
    address: AddressDto[];
}

export class CompleteProfileDto {

    @IsNotEmpty({message:i18nValidationMessage('dto.PHONE_NUMBER_IS_REQUIRED') })
    @IsString({message:i18nValidationMessage('dto.PHONE_NUMBER_MUST_BE_A_STRING') })
    @IsPhoneNumber('EG',{message:i18nValidationMessage('dto.PHONE_NUMBER_MUST_EG') })
    @Length(11, 11, {message:i18nValidationMessage('dto.PHONE_NUMBER_MUST_BE_11') })
    phoneNumber: string;


    @IsNotEmpty({message:i18nValidationMessage('dto.ADDRESS_IS_REQUIRED') })
    @Type(()=> TempUserDto)
    tempUser: TempUserDto; 
}