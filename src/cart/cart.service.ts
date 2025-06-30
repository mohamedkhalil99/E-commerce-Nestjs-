import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './cart.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { Coupon } from 'src/coupon/coupon.schema';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class CartService 
{
  constructor(@InjectModel(Cart.name)private cartModel:Model<Cart>,
              @InjectModel(Product.name)private productModel:Model<Product>,
              @InjectModel(Coupon.name)private couponModel:Model<Coupon>){}
  
  async create(createCartDto: CreateCartDto, productId: string, userId:string, i18n: I18nContext) :Promise<{status:number,length:number,message:string,data:Cart}>
  {
    const product= await this.productModel.findById(productId);
    //check if product exists
    if(!product){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.PRODUCT')}}));}
    //check if product is in stock
    if(product.stock<=0){throw new NotFoundException(i18n.t('service.PRODUCT_OUT_OF_STOCK'));}
    if(product.stock<createCartDto.quantity){throw new NotFoundException(i18n.t('service.STOCK_LOWER_THAN_QUANTITY'));}
    
    //if user has cart, add product to cart
    const ifUserHasCart = await this.cartModel.findOne({user:userId});
    if(ifUserHasCart)
    {
      //check if product already exists in cart
      const ifProductExists = ifUserHasCart.cartItems.find(item=>item.productId.toString() === productId);
      if(ifProductExists){ifProductExists.quantity+=createCartDto.quantity;}
      //else add new product to cart
      else
      {
        ifUserHasCart.cartItems.push({productId: new Types.ObjectId(productId), quantity: createCartDto.quantity, color:''});
        await ifUserHasCart.save();
      }
      // calculate total price
      let totalPrice = 0;
      for (const item of ifUserHasCart.cartItems) 
      {
      const itemProduct = await this.productModel.findById(item.productId);
      if(itemProduct.priceAfterDiscount>0){totalPrice += item.quantity * (itemProduct ? itemProduct.priceAfterDiscount : 0);}
      else {totalPrice += item.quantity * (itemProduct ? itemProduct.price : 0);}
      }
      ifUserHasCart.totalPrice = totalPrice;
      //calculate price after coupon discount
      let totalDiscount = 0;
      for (const cartCoupon of ifUserHasCart.coupon) 
      {
        const appliedCoupon = await this.couponModel.findOne({name:cartCoupon.name})
        if (appliedCoupon) {totalDiscount += appliedCoupon.discount;}
      }
      ifUserHasCart.totalPriceAfterDiscount = ifUserHasCart.totalPrice - totalDiscount;//(cart.totalPrice*coupon.discount/100);

      await ifUserHasCart.save();
      return {status:201, length:ifUserHasCart.cartItems.length, message:i18n.t('service.PRODUCT_ADDED_TO_CART'), data:ifUserHasCart};
    }
    //else create cart and add product to cart
    else
    {
      const newCart = await this.cartModel.create({cartItems:[{productId: new Types.ObjectId(productId),quantity:createCartDto.quantity,color:''}]
      ,totalPrice:product.price*createCartDto.quantity
      ,user:userId});
      // calculate total price
      let totalPrice=0;
      if(product.priceAfterDiscount>0){newCart.cartItems.forEach(item=>{totalPrice+=(item.quantity*product.priceAfterDiscount);});}
      else {newCart.cartItems.forEach(item=>{totalPrice+=(item.quantity*product.price);});}    
      newCart.totalPrice=totalPrice;
      //calculate price after coupon discount
      let totalDiscount = 0;
      for (const cartCoupon of newCart.coupon) 
      {
        const appliedCoupon = await this.couponModel.findOne({name:cartCoupon.name})
        if (appliedCoupon) {totalDiscount += appliedCoupon.discount;}
      }
      newCart.totalPriceAfterDiscount = newCart.totalPrice - totalDiscount;//(cart.totalPrice*coupon.discount/100);
      await newCart.save();
      return{status:201, length:newCart.cartItems.length, message:i18n.t('service.PRODUCT_ADDED_TO_CART'), data:newCart};
    }
  }

  async applyCoupon(couponName: string, userId: string, i18n: I18nContext) :Promise<{status:number,message:string,data:Cart}>
  {    
    const coupon = await this.couponModel.findOne({name:couponName});    
    //check if coupon exists
    if(!coupon){throw new NotFoundException(i18n.t('service.INVALID', {args:{property:i18n.t('service.COUPON')}}));}
    const cart = await this.cartModel.findOne({user:userId});    
    //check if cart exists
    if(!cart){throw new NotFoundException(i18n.t('service.CART_IS_EMPTY'));}
    //check if coupon is valid
    if(coupon.expireDate< new Date()){throw new ConflictException(i18n.t('service.COUPON_EXPIRED'));}
    //check if coupon already exists in cart
    const ifCouponExists = cart.coupon.find(item=>item.name.toString()===couponName);
    if(ifCouponExists){throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.COUPON')}}));}
    //make sure just one coupon is applied
    if(cart.coupon.length>0){throw new ConflictException(i18n.t('service.COUPON_ALREADY_APPLIED_NO_MORE_COUPONS'));}
    //if user used this coupon before, he cannot use it again
    if(coupon.usedBy.includes(new Types.ObjectId(userId))){throw new ConflictException(i18n.t('service.COUPON_ALREADY_USED'));}
    //add user to coupon users
    coupon.usedBy.push(new Types.ObjectId(userId));
    await coupon.save();
    
    //add coupon to cart
    cart.coupon.push({name:coupon.name,couponId:coupon.id});
    //calculate total price after discount
    let totalDiscount = 0;
    for (const cartCoupon of cart.coupon) 
      {
        const appliedCoupon = await this.couponModel.findOne({name:cartCoupon.name})
        if (appliedCoupon) {totalDiscount += appliedCoupon.discount;}
      }
    //check if total Price After Discount is less than coupon discount
    if(cart.totalPriceAfterDiscount<coupon.discount||cart.totalPriceAfterDiscount-coupon.discount<0){cart.totalPriceAfterDiscount=0;}
    else{cart.totalPriceAfterDiscount = cart.totalPrice - totalDiscount;}//(cart.totalPrice*coupon.discount/100);
    
    await cart.save();
    return {status:200, message:i18n.t('service.COUPON_APPLIED', {args:{ discount: coupon.discount }}), data:cart};
  }
  
  async findOne(userId:string, i18n: I18nContext) :Promise<{status:number,message:string,data:Cart}>
  {
    const cart=await this.cartModel.findOne({user:userId}).populate('cartItems.productId','price title coverImage stock description _id priceAfterDiscount');
    if(!cart){throw new NotFoundException(i18n.t('service.CART_IS_EMPTY'));}
    return{status:200, message:i18n.t('service.CART_ITEMS', {args: { count: cart.cartItems.length }}), data:cart};
  }

  async update(updateCartDto: UpdateCartDto, productId: string, userId:string, i18n: I18nContext) :Promise<{status:number,length:number,message:string,data:Cart}>
  {
    const product = await this.productModel.findById(productId);
    //check if product exists
    if(!product){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.PRODUCT')}}));}
    //check if product is in stock
    if(product.stock<=0){throw new NotFoundException(i18n.t('service.PRODUCT_OUT_OF_STOCK'));}
    if(product.stock<updateCartDto.quantity){throw new NotFoundException(i18n.t('service.STOCK_LOWER_THAN_QUANTITY'));}
    
    const cart=await this.cartModel.findOne({user:userId}).populate('cartItems.productId','price title coverImage stock description _id priceAfterDiscount');
    //check if cart did not exist
    if(!cart)
      {
      const newCart = await this.cartModel.create({cartItems:[{productId: new Types.ObjectId(productId),quantity:updateCartDto.quantity,color:''}]
      ,totalPrice:product.price*updateCartDto.quantity
      ,user:userId});
      // calculate total price
      let totalPrice=0;
      if(product.priceAfterDiscount>0){newCart.cartItems.forEach(item=>{totalPrice+=(item.quantity*product.priceAfterDiscount);});}
      else {newCart.cartItems.forEach(item=>{totalPrice+=(item.quantity*product.price);}); }    
      newCart.totalPrice=totalPrice;
      //calculate price after coupon discount
      let totalDiscount = 0;
      for (const cartCoupon of newCart.coupon) 
      {
        const appliedCoupon = await this.couponModel.findOne({name:cartCoupon.name})
        if (appliedCoupon) {totalDiscount += appliedCoupon.discount;}
      }
      //check if total Price After Discount is less than coupon discount
      const coupon = await this.couponModel.findOne({name:newCart.coupon[0].name});
      if(newCart.totalPriceAfterDiscount<coupon.discount||newCart.totalPriceAfterDiscount-coupon.discount<0){newCart.totalPriceAfterDiscount=0;}
      else{newCart.totalPriceAfterDiscount = newCart.totalPrice - totalDiscount;}//(cart.totalPrice*coupon.discount/100);

      await newCart.save();
      return{status:200, length:newCart.cartItems.length, message:i18n.t('service.PRODUCT_ADDED_TO_CART'), data:newCart};
    }

    //check if product exists in cart
    const productIndex=cart.cartItems.findIndex(item=>item.productId.id.toString()===productId);
    if(productIndex===-1){throw new NotFoundException(i18n.t('service.PRODUCT_NOT_IN_CART'));}
    //update color
    if(updateCartDto.color){cart.cartItems[productIndex].color=updateCartDto.color;}
    //update product quantity
    if(updateCartDto.quantity)
    {
      cart.cartItems[productIndex].quantity=updateCartDto.quantity;
      //calculate total price
      let totalPrice = 0;
      for (const item of cart.cartItems) 
      {
      const itemProduct = await this.productModel.findById(item.productId);
      if(itemProduct.priceAfterDiscount>0){totalPrice += item.quantity * (itemProduct ? itemProduct.priceAfterDiscount : 0);}
      else {totalPrice += (item.quantity * (itemProduct ? itemProduct.price : 0));}
      }
      cart.totalPrice = totalPrice;
      //calculate price after coupon discount
      let totalDiscount = 0;
      for (const cartCoupon of cart.coupon) 
      {
        const appliedCoupon = await this.couponModel.findOne({name:cartCoupon.name})
        if (appliedCoupon) {totalDiscount += appliedCoupon.discount;}
      }
      //check if total Price After Discount is less than coupon discount
      const coupon = await this.couponModel.findOne({name:cart.coupon[0].name});
      if(cart.totalPriceAfterDiscount<coupon.discount||cart.totalPriceAfterDiscount-coupon.discount<0){cart.totalPriceAfterDiscount=0;}
      else{cart.totalPriceAfterDiscount = cart.totalPrice - totalDiscount;}//(cart.totalPrice*coupon.discount/100);
    } 

    await cart.save();
    return {status:200, length:cart.cartItems.length, message:i18n.t('service.UPDATED_SUCCESSFULLY', {args:{property:i18n.t('service.CART')}}), data:cart};
  }
  
  async remove(productId: string, userId:string, i18n: I18nContext) :Promise<{status:number,length:number,message:string,data:Cart}>
  {
    const product = await this.productModel.findById(productId);
    //check if product exists
    if(!product){throw new NotFoundException(i18n.t('service.NOT_FOUND', {args:{property:i18n.t('service.PRODUCT')}}));}
    
    const cart=await this.cartModel.findOne({user:userId}).populate('cartItems.productId','price title coverImage stock description _id priceAfterDiscount');
    //check if cart did not exist
    if(!cart){throw new NotFoundException(i18n.t('service.CART_IS_EMPTY'));}
    //check if product exists in cart
    const productIndex=cart.cartItems.findIndex(item=>item.productId.id.toString()===productId);
    if(productIndex===-1){throw new NotFoundException(i18n.t('service.PRODUCT_NOT_IN_CART'));}
    //remove product from cart
    cart.cartItems.splice(productIndex,1);
    //calculate total price
    let totalPrice = 0;
    for (const item of cart.cartItems) 
    {
    const itemProduct = await this.productModel.findById(item.productId);
    if(itemProduct.priceAfterDiscount>0){totalPrice += item.quantity * (itemProduct ? itemProduct.priceAfterDiscount : 0);}
    else { totalPrice += item.quantity * (itemProduct ? itemProduct.price : 0);}
  }
  cart.totalPrice = totalPrice;
    //calculate price after coupon discount
    let totalDiscount = 0;
    for (const cartCoupon of cart.coupon) 
    {
      const appliedCoupon = await this.couponModel.findOne({name:cartCoupon.name})
      if (appliedCoupon) {totalDiscount += appliedCoupon.discount;}
    }
    //check if total Price After Discount is less than coupon discount
    cart.totalPriceAfterDiscount = cart.totalPrice - totalDiscount;//(cart.totalPrice*coupon.discount/100);
    if(cart.totalPriceAfterDiscount<0){cart.totalPriceAfterDiscount=0;}
    
    await cart.save();
    return {status:200, length:cart.cartItems.length, message:i18n.t('service.', {args:{property:i18n.t('service.PRODUCT_REMOVED_FROM_CART')}}), data:cart};
  }

  //***For Admin***\\
  
  async findOneByAdmin(userId: string, i18n: I18nContext) :Promise<{status:number,message:string,data:Cart}>
  {
    const cart = await this.cartModel.findOne({user:userId}).populate('cartItems.productId','price title coverImage stock description _id priceAfterDiscount');
    if(!cart){throw new NotFoundException(i18n.t('service.USER_HAS_NO_CART'));}
    return {status:200, message:i18n.t('service.USER_CART_ITEMS', {args:{ count: cart.cartItems.length }}), data:cart};//`User has ${cart.cartItems.length} item in cart`
  }

  async findAllByAdmin(i18n: I18nContext) :Promise<{status:number,message:string,data:Cart[]}>
  {
    const carts = await this.cartModel.find().populate('cartItems.productId','price title coverImage stock description _id priceAfterDiscount');
    if(!carts){throw new NotFoundException(i18n.t('service.USERS_HAVE_NO_CARTS'));}
    return {status:200, message:i18n.t('service.FOUND_CARTS', {args: { count: carts.length }}), data:carts};//`Found ${carts.length} carts`
  }
}