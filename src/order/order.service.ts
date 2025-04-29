import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateDeliveryDto } from './dto/update-order.dto';
import { Order } from './order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from 'src/cart/cart.schema';
import { Tax } from 'src/tax/tax.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/user/user.schema';
import stripe from "stripe";
import { Product } from 'src/product/product.schema';
import { MailerService } from '@nestjs-modules/mailer';

const istripe = new stripe('sk_test_51Qt7gvGmYWix3VAi6LZSxu7lePV5uqaCtc9kdVyCs2y8TbVIvvfws0d5fTaFdBm5WUsBj5XANWkYr08lA9Afpnxj00ya5mdvfl')

@Injectable()
export class OrderService 
{
  constructor(@InjectModel(Order.name)private orderModel:Model<Order>,
              @InjectModel(Cart.name)private cartModel:Model<Cart>,
              @InjectModel(Tax.name)private taxModel:Model<Tax>,
              @InjectModel(User.name)private userModel:Model<User>,
              @InjectModel(Product.name)private productModel:Model<Product>,private readonly mailService: MailerService){}
  
  async create( createOrderDto:CreateOrderDto,paymentMethod: 'cash'|'card', userId: string)
  {
    //make sure methods are cash or card
    if(!['cash','card'].includes(paymentMethod)){throw new NotFoundException('You must choose whether to pay by cash or card')}

    const cart = await this.cartModel.findOne({user:userId});
    if(!cart){throw new NotFoundException('Your shopping Cart looks empty');}

    const taxes = await this.taxModel.findOne();

    const user = await this.userModel.findById(userId);
    
    const shippingAddress = user?.address?.length ? user.address[0] : createOrderDto?.shippingAddress;
    if(!shippingAddress){throw new NotFoundException('You must add a shipping address');}

    if(!user?.address||user.address.length===0){await this.userModel.findByIdAndUpdate(userId,{/*$push*/$set:{address:[shippingAddress]}})};

    const data =
    {
      user:userId,
      cartItems:cart.cartItems,
      tax:Math.round(((cart.totalPrice*taxes.tax)/(100+taxes.tax))*10)/10,
      shippingFees:taxes.shippingFees,
      cashOnDelivery:taxes.cashOnDelivery,
      orderTotalPrice:cart.totalPriceAfterDiscount,
      paymentMethod,
      shippingAddress:user.address,
    };

    if(paymentMethod==='cash')
    {
      data.orderTotalPrice+=(data.shippingFees+taxes.cashOnDelivery);
      const order = await this.orderModel.create({...data,isPaid:false,isDeliverd:false});
      //update product sold and stock
      for (const item of cart.cartItems) 
      {
        await this.productModel.findByIdAndUpdate(item.productId,{$inc:{stock:-item.quantity,sold:+item.quantity}},{new:true}) 
      }
      //Reset Cart
      await this.cartModel.deleteOne({ user: userId });
      //Send the order confrmation to the email
      const { addressDetails, district, city } = order.shippingAddress[0];

      const htmlmsg = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #007bff; text-align: center;">Order Confirmation</h1>
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Thank you for your order! We have received your order and are currently processing it.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            <p><strong>Order Number:</strong> ${order._id}</p>
            <p><strong>Shipping Address:</strong> ${addressDetails}, ${district}, ${city}</p>
            <p><strong>Tax:</strong> EGP ${order.tax}</p>
            <p><strong>Shipping Fees:</strong> EGP ${order.shippingFees}</p>
            <p><strong>Cash On Delivery Fees:</strong> EGP ${order.cashOnDelivery}</p>
            <p><strong>Total Price:</strong> EGP ${order.orderTotalPrice}</p>
          </div>
      
          <p style="text-align: center; margin-top: 20px;">We appreciate your trust in us and look forward to serving you again.</p>
          <p style="text-align: center; font-size: 14px; color: #666;">If you have any questions, please contact our support team.</p>
        </div>
      `;  
      
      await this.mailService.sendMail
      ({
          from: `E-Commerce-Nestjs <${process.env.EMAIL_USERNAME}>`,
          to:user.email,
          subject: 'E-Commerce-Nestjs | Order Confirmation',
          html: htmlmsg,
      });
      return {status:201,message:'Order Created successfully',data:order}
    }

    const session = await istripe.checkout.sessions.create
    ({
      payment_method_types: ['card'],
      line_items: 
      [{
        price_data: {currency: 'egp',unit_amount: Math.round(data.orderTotalPrice * 100),
        product_data: {name: 'E-Commerce-Nestjs',images: [process.env.LOGO]},},
        quantity: 1,
      },
      {
        price_data: {currency: 'egp',unit_amount: Math.round(data.shippingFees * 100),
        product_data: {name: 'Shipping Fees',},},
        quantity: 1,
      },],
      mode: 'payment',
      success_url: 'https://www.gsmarena.com/',
      cancel_url: 'https://www.gsmarena.com/',
      client_reference_id: userId.toString(),
      customer_email: user.email,
      metadata: 
      {
        shippingAddress: JSON.stringify(data.shippingAddress),
        Tax: data.tax ? String(Math.round(data.tax)) : '0',
      },
    });
    return {status:201,data:{url:session.url,sessionId:session.id,orderTotalPrice:session.amount_total/100,success_url:`${session.success_url}?session_id=${session.id}`,cancel_url:session.cancel_url,createdAt:new Date(session.created*1000),expires_at:new Date(session.expires_at*1000)}};
  }

  async updateDelivery(orderId: string, updateDeliveryDto: UpdateDeliveryDto) 
  {
    const order = await this.orderModel.findById(orderId);
    if(!order){throw new NotFoundException('Order not found');}
    
    if(order.isDeliverd){throw new ConflictException('Order already Delivered');}
    if(updateDeliveryDto.isDeliverd!==true){throw new ConflictException('You must confirm delivery');}
    if(order.paymentMethod==='card')
    {    
      order.isDeliverd=true;
      order.deliverdAt=new Date();
      await order.save();
      return {status:200,message:'Order Delivered successfully',data:order};
    }
    order.isPaid=true;
    order.isDeliverd=true;
    order.paidAt=new Date();
    order.deliverdAt=new Date();
    await order.save();
    return {status:200,message:'Order Delivered successfully',data:order};
  }

  async paidConfirmation(payload:any,sig:any,endpointSecret:string)
  {
    let event; 
    try{event = istripe.webhooks.constructEvent(payload,sig,endpointSecret);}
    catch(error){console.log(`Webhook Error: ${error.message}`);return;}

    try
    {
    if(event.type==='checkout.session.completed')//'payment_intent.succeeded')
    {
      const session = event.data.object; 
      const user_id = session.client_reference_id;

      const cart = await this.cartModel.findOne({user:user_id});
      if(!cart){throw new NotFoundException('Your shopping Cart looks empty');}
  
      const taxes = await this.taxModel.findOne();
  
      const user = await this.userModel.findById(user_id);
  
      const data =
      {
        user:user_id,
        cartItems:cart.cartItems,
        tax:Math.round(((cart.totalPrice*taxes.tax)/(100+taxes.tax))*10)/10,
        shippingFees:taxes.shippingFees,
        orderTotalPrice:cart.totalPriceAfterDiscount,
        paymentMethod:'card',
        shippingAddress:user.address,
      };
      data.orderTotalPrice+=data.shippingFees;
      const order = await this.orderModel.create({...data,isPaid:true,isDeliverd:false,paidAt:new Date(session.created*1000)});
      //update product sold and stock
      await Promise.all(cart.cartItems.map(item => this.productModel.findByIdAndUpdate(item.productId, 
      { $inc: { stock: -item.quantity, sold: +item.quantity }}, { new: true })));
      //Reset Cart
      await this.cartModel.deleteOne({user:user_id});
      
      //Send the order confrmation to the email
      const { addressDetails, district, city } = order.shippingAddress[0];
      
      const htmlmsg = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="color: #007bff; text-align: center;">Order Confirmation</h1>
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>Thank you for your order! We have received your order and are currently processing it.</p>
                      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
      <p><strong>Order Number:</strong> ${order._id}</p>
      <p><strong>Shipping Address:</strong> ${addressDetails}, ${district}, ${city}</p>
      <p><strong>Tax:</strong> EGP ${order.tax}</p>
      <p><strong>Shipping Fees:</strong> EGP ${order.shippingFees}</p>
      <p><strong>Cash On Delivery Fees:</strong> EGP ${order.cashOnDelivery}</p>
      <p><strong>Total Price:</strong> EGP ${order.orderTotalPrice}</p>
      </div>
                  
      <p style="text-align: center; margin-top: 20px;">We appreciate your trust in us and look forward to serving you again.</p>
      <p style="text-align: center; font-size: 14px; color: #666;">If you have any questions, please contact our support team.</p>
      </div>
      `;  
                  
      await this.mailService.sendMail
      ({
      from: `E-Commerce-Nestjs <${process.env.EMAIL_USERNAME}>`,
      to:user.email,
      subject: 'E-Commerce-Nestjs | Order Confirmation',
      html: htmlmsg,
      });
      return {status:201,message:'Order Created successfully',data:order}
    }
    }
    catch(error){return {status:400,message:'Failed to create order',error:error.message}}
  }

  async findAllOrdersByAdmin()
  {
    const orders = await this.orderModel.find();
    if(!orders){throw new NotFoundException('No Orders found');}
    if(orders.length===0){throw new NotFoundException('No Orders found');}
    return {status:200,length:orders.length,data:orders};
  }

  async findAllUserOrdersByAdmin(userId:string)
  {
    const user = await this.userModel.findById(userId);
    if(!user){throw new NotFoundException('User not found');}
    const orders = await this.orderModel.find({user:userId});
    if(!orders){throw new NotFoundException('No Orders found');}
    if(orders.length===0){throw new NotFoundException('No Orders found');}
    return {status:200,length:orders.length,data:orders};
  }

  async findAllOrdersByUser(userId:string) 
  {
    const orders = await this.orderModel.find({user:userId});
    if(!orders){throw new NotFoundException('No Orders found');}
    if(orders.length===0){throw new NotFoundException('No Orders found');}
    return {status:200,length:orders.length,data:orders};
  }
}