import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@Controller('tax')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class TaxController 
{
  constructor(private readonly taxService: TaxService) {}

  //Desc: Admin can Create a new Tax, shippingFees and cashOnDeliveryFees
  //Route: POST api/v1/tax
  //Access: Private (admin only)
  @Roles(['admin'])
  @Post()
  createOrUpdateTax(@Body() createTaxDto: CreateTaxDto) 
  {
    return this.taxService.createOrUpdateTax(createTaxDto);
  }

  //Desc: Admin can Get All Taxes
  //Route: GET api/v1/tax
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get()
  findTax() 
  {
    return this.taxService.findTax();
  }
}