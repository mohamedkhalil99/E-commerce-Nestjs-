import { IsDateString, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateCouponDto 
{
    @IsNotEmpty({message: "Coupon name is required"})
    @IsString({message: "Coupon name must be a string"})
    @MinLength(3, {message: "Coupon name must be at least 3 characters"})
    @MaxLength(20, {message: "Coupon name must be at most 20 characters"})
    name: string;

    @IsNotEmpty({message: "Coupon expire date is required"})
    @IsDateString({},{message: "Coupon expire date must be a valid date"})
    expireDate: Date;

    @IsNotEmpty({message: "Coupon discount is required"})
    @IsNumber({}, {message: "Coupon discount must be a number"})
    @Min(1, {message: "Coupon discount must be at least 1"})
    discount: number;
}