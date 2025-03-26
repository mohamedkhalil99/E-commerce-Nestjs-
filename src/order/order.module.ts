import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { WebhookController, CheckoutController, OrderController } from './order.controller';
import { Order, OrderSchema } from './order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from 'src/cart/cart.schema';
import { Tax, TaxSchema } from 'src/tax/tax.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { Product, ProductSchema } from 'src/product/product.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema },
    { name: Cart.name, schema: CartSchema },
    { name: Tax.name, schema: TaxSchema },
    { name: User.name, schema: UserSchema },
    { name: Product.name, schema: ProductSchema },
  ]),
],
  controllers: [CheckoutController,OrderController,WebhookController],
  providers: [OrderService],
})
export class OrderModule {}