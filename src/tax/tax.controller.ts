import { Controller, Get, Post, Body, UseGuards, UseFilters } from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

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
  @UseFilters(new I18nValidationExceptionFilter())
  createOrUpdateTax(@Body() createTaxDto: CreateTaxDto, @I18n() i18n: I18nContext) 
  {
    return this.taxService.createOrUpdateTax(createTaxDto, i18n);
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