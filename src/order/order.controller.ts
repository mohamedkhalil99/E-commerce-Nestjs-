import { Controller, Get, Post, Body, Patch, Param, UseGuards, ValidationPipe, Req, RawBodyRequest, Headers } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateDeliveryDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { Request } from 'express';

@Controller('webhook')
export class WebhookController 
{
  constructor(private readonly orderService: OrderService) {}

  //Desc: webhook to handle stripe events
  //Route: POST api/v1/webhook 
  //Access: Private (stripe only)
  @Post()
  paidConfirmation(@Headers('stripe-signature') sig, @Req() req: RawBodyRequest<Request>)
  {
    const endpointSecret = process.env.WEBHOOK_SECRET;
    const payload = req.rawBody;    
    return this.orderService.paidConfirmation(payload,sig,endpointSecret);
    //stripe login
    //stripe listen --forward-to localhost:3000/api/v1/webhook
    //4242 4242 4242 4242
  }
}

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
  create(@Param('paymentMethod') paymentMethod: 'cash'|'card', @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createOrderDto: CreateOrderDto,@Req() req) 
  {
    const userId = req.user.id;
    return this.orderService.create(createOrderDto,paymentMethod,userId);
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
  updateDelivery(@Param('orderId') orderId: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateDeliveryDto: UpdateDeliveryDto) 
  {
    return this.orderService.updateDelivery(orderId, updateDeliveryDto);
  }

  //Desc: admin can Get all orders
  //Route: GET api/v1/order/admin
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get('admin')
  findAllOrdersByAdmin()
  {
    return this.orderService.findAllOrdersByAdmin();
  }

  //Desc: admin can Get all orders
  //Route: GET api/v1/order/admin/:userId
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get('admin/:userId')
  findAllUserOrdersByAdmin(@Param('userId') userId: string)
  {
    return this.orderService.findAllUserOrdersByAdmin(userId);
  }

  //Desc: user can Get all his orders
  //Route: GET api/v1/order/user
  //Access: Private (user only)
  @Roles(['user'])
  @Get('user')
  findAllOrdersByUser(@Req() req)
  {
    const userId = req.user.id;
    return this.orderService.findAllOrdersByUser(userId);
  }
}