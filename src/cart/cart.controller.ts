import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';

@Controller('cart')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class CartController 
{
  constructor(private readonly cartService: CartService) {}

  //Desc: User can Create a new cart
  //Route: POST api/v1/cart/:productId
  //Access: Private (user only)
  @Roles(['user'])
  @Post(':productId')
  create(@Param('productId') productId: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createCartDto: CreateCartDto,@Req() req) 
  {
    const userId = req.user.id;
    return this.cartService.create(createCartDto,productId,userId);
  }

  //Desc: User can apply a coupon to the cart
  //Route: POST api/v1/cart/coupon/:couponName
  //Access: Private (user only)
  @Roles(['user'])
  @Post('coupon/:couponName')
  applyCoupon(@Param('couponName') couponName: string,@Req() req) 
  {
    const userId = req.user.id;
    return this.cartService.applyCoupon(couponName,userId);
  }

  //Desc: User can Get the cartItems
  //Route: PATCH api/v1/cart
  //Access: Private (user only)
  @Roles(['user'])
  @Get()
  findOne(@Req() req) 
  {
    const userId = req.user.id;
    return this.cartService.findOne(userId);
  }

  //Desc: User can Update a cartItem
  //Route: PATCH api/v1/cart/:productId
  //Access: Private (user only)
  @Roles(['user'])
  @Patch(':productId')
  update(@Param('productId') productId: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateCartDto: UpdateCartDto,@Req() req) 
  {
    const userId = req.user.id;
    return this.cartService.update(updateCartDto,productId,userId);
  }

  //Desc: User can Delete a cartItem
  //Route: DELETE api/v1/cart/:productId
  //Access: Private (user only)
  @Roles(['user'])
  @Delete(':productId')
  remove(@Param('productId') productId: string,@Req() req) 
  {
    const userId = req.user.id;
    return this.cartService.remove(productId,userId);
  }

  //***For Admin***\\

  //Desc: Admin can Get any user's cartItems
  //Route: GET api/v1/cart/admin/:userId
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get('admin/:userId')
  findOneByAdmin(@Param('userId') userId: string)
  {
    return this.cartService.findOneByAdmin(userId);
  }

  //Desc: Admin can Get All users cartItems
  //Route: GET api/v1/cart/admin
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get('admin')
  findAllByAdmin()
  {
    return this.cartService.findAllByAdmin();
  }
}