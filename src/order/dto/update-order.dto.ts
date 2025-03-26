import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateDeliveryDto
{
    @IsNotEmpty({message:'isDeliverd is required'})
    @IsBoolean({message:'isDeliverd must be a boolean'})
    isDeliverd:boolean;
}