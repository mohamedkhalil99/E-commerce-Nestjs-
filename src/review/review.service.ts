import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.schema';
import { User } from 'src/user/user.schema';

interface NewCreateReviewDto extends CreateReviewDto
{
  user:string;//to auto add user without dto
}

@Injectable()
export class ReviewService 
{
  constructor(@InjectModel(Review.name)private reviewModel:Model<Review>,
              @InjectModel(Product.name)private productModel:Model<Product>,
              @InjectModel(User.name)private userModel:Model<User>){}
  
  async create(createReviewDto: NewCreateReviewDto) :Promise<{status:number,message:string,data:Review}>
  {
    //Check if User exists
    const user = await this.userModel.findById(createReviewDto.user);
    if(!user){throw new NotFoundException('User not found');}
    //Check if Product exists
    const product = await this.productModel.findById(createReviewDto.product);
    if(!product){throw new NotFoundException('Product not found');}
    //Search for Review
    const review = await this.reviewModel.findOne({user: createReviewDto.user,product:createReviewDto.product});
    if(review){throw new ConflictException('Review already exists');}
    //Create Review
    const newReview = await (await this.reviewModel.create(createReviewDto)).populate('user product','name title coverImage');
    //update product rating
    const reviews = await this.reviewModel.find({product:product.id});
    let rating =0;
    reviews.forEach(review=>{rating+=review.rating});
    product.averageRating =rating/reviews.length;
    product.averageRating =Math.round(product.averageRating*10)/10;
    product.ratingQuantity = reviews.length;
    await product.save();
    return {status:201,message:'Review created successfully',data:newReview};
  }

  async findAll(productId:string) :Promise<{status:number,length:number,data:Review[]}>
  {
    const reviews = await this.reviewModel.find({product:productId}).populate('user product','name email title');
    return{status:200,length:reviews.length,data:reviews};
  }

  async findOne(id: string) 
  {
    const userReviews = await this.reviewModel.find({user:id}).populate('user product','name email title');
    return{status:200,length:userReviews.length,data:userReviews};
  }

  async update(id: string, updateReviewDto: any,req:any) :Promise<{status:number,message:string,data:Review}>
  {
    const findReview = await this.reviewModel.findById(id).select('-__v').populate('user', '-password -__v -role -verificationCode -phoneNumber');
    //Get User ID from the Request and Make sure that User can Update his Review
    const userRequestId=req.user.id;
    if(userRequestId.toString() !== findReview.user.id.toString()){throw new UnauthorizedException();}
    if(!findReview){throw new NotFoundException('Review not found');}
    //update Review
    const updatedReview = await this.reviewModel.findByIdAndUpdate(id,updateReviewDto,{new:true}).select('-__v').populate('user product','name email title');
    //update product rating
    const product = await this.productModel.findById(updatedReview.product);
    const reviews = await this.reviewModel.find({product:product.id});
    let rating=0;
    reviews.forEach(review=>{rating+=review.rating});
    product.averageRating =rating/reviews.length;
    product.averageRating =Math.round(product.averageRating*10)/10;
    product.ratingQuantity=reviews.length;
    await product.save();
    return {status:200,message:'Review updated successfully',data:updatedReview};
  }

  async remove(id: string,req:any) :Promise<{status:number,message:string}>
  {
    const findReview = await this.reviewModel.findById(id).select('-__v').populate('user', '-password -__v -role -verificationCode -phoneNumber');
    //Get User ID from the Request and Make sure that User can Update his Review
    const userRequestId=req.user.id;
    if(userRequestId.toString() !== findReview.user.id.toString()){throw new UnauthorizedException();}
    if(!findReview){throw new NotFoundException('Review not found');}  
    //Delete Review
    await this.reviewModel.findByIdAndDelete(id);
    //update product rating
    const product = await this.productModel.findById(findReview.product);
    const reviews = await this.reviewModel.find({product:product.id});
    let rating=0;
    reviews.forEach(review=>{rating+=review.rating});
    product.averageRating =rating/reviews.length;
    product.averageRating =Math.round(product.averageRating*10)/10;
    product.ratingQuantity=reviews.length;
    await product.save();
    return {status:200,message:'Review deleted successfully'};
  }
}