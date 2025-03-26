import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

class ShippingAddressDto 
{
    @IsString()
    name: string;
  
    @IsString()
    addressDetails: string;
  
    @IsString()
    district: string;
  
    @IsString()
    city: string;
  
    @IsString()
    phone: string;
}

export class CreateOrderDto 
{
    @IsOptional()
    @ValidateNested()
    @Type(() => ShippingAddressDto)
    shippingAddress: ShippingAddressDto;
}