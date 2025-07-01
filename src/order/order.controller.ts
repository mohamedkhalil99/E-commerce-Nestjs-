import { Controller, Get, Post, Body, Patch, Param, UseGuards, ValidationPipe, Req, RawBodyRequest, Headers, UseFilters } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateDeliveryDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { Request } from 'express';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('checkout')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class CheckoutController 
{
  constructor(private readonly orderService: OrderService) {}

  //Desc: user can Create order and start Session to checkout
  //Route: POST api/v1/checkout
  //Access: Private (user only)
  @Roles(['user'])
  @Post(':paymentMethod')
  @UseFilters(new I18nValidationExceptionFilter())
  create(@Param('paymentMethod') paymentMethod: 'cash'|'card', @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createOrderDto: CreateOrderDto, @Req() req, @I18n() i18n: I18nContext) 
  {
    const userId = req.user.id;
    return this.orderService.create(createOrderDto, paymentMethod, userId, i18n);
  }
}

@Controller('order')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class OrderController
{
  constructor(private readonly orderService: OrderService){}
  
  //Desc: admin can Update delivery status 
  //Route: PATCH api/v1/order/admin/deliveryConfirmaton/:orderId
  //Access: Private (admin only)
  @Roles(['admin'])
  @Patch('admin/deliveryConfirmation/:orderId')
  @UseFilters(new I18nValidationExceptionFilter())
  updateDelivery(@Param('orderId') orderId: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateDeliveryDto: UpdateDeliveryDto, @I18n() i18n: I18nContext) 
  {
    return this.orderService.updateDelivery(orderId, updateDeliveryDto, i18n);
  }

  //Desc: admin can Get all orders
  //Route: GET api/v1/order/admin
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get('admin')
  findAllOrdersByAdmin(@I18n() i18n: I18nContext)
  {
    return this.orderService.findAllOrdersByAdmin(i18n);
  }

  //Desc: admin can Get all orders
  //Route: GET api/v1/order/admin/:userId
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get('admin/:userId')
  findAllUserOrdersByAdmin(@Param('userId') userId: string, @I18n() i18n: I18nContext)
  {
    return this.orderService.findAllUserOrdersByAdmin(userId, i18n);
  }

  //Desc: user can Get all his orders
  //Route: GET api/v1/order/user
  //Access: Private (user only)
  @Roles(['user'])
  @Get('user')
  findAllOrdersByUser(@Req() req, @I18n() i18n: I18nContext)
  {
    const userId = req.user.id;
    return this.orderService.findAllOrdersByUser(userId, i18n);
  }
}

@Controller('webhook')
export class WebhookController 
{
  constructor(private readonly orderService: OrderService) {}

  //Desc: webhook to handle stripe events
  //Route: POST api/v1/webhook 
  //Access: Private (stripe only)
  @Post()
  paidConfirmation(@Headers('stripe-signature') sig, @Req() req: RawBodyRequest<Request>, @I18n() i18n: I18nContext)
  {
    const endpointSecret = process.env.WEBHOOK_SECRET;
    const payload = req.rawBody;    
    return this.orderService.paidConfirmation(payload, sig, endpointSecret, i18n);
    //stripe login
    //stripe listen --forward-to localhost:3000/api/v1/webhook
    //4242 4242 4242 4242
  }
}