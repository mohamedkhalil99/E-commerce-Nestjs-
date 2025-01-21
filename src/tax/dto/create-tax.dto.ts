import { IsNumber, IsOptional } from "class-validator";

export class CreateTaxDto 
{
    @IsOptional()
    @IsNumber({},{message:'Tax Must be a Number'})
    tax:number;

    @IsOptional()
    @IsNumber({},{message:'Shipping Fee Must be a Number'})
    shippingFees:number;
}