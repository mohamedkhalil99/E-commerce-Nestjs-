import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, Req, UseFilters } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UpdateReviewDto } from './dto/update-review.dto';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('review')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class ReviewController 
{
  constructor(private readonly reviewService: ReviewService) {}

  //Desc: User can Create a new Review
  //Route: POST api/v1/review
  //Access: Private (user only)
  @Roles(['user'])
  @Post()
  @UseFilters(new I18nValidationExceptionFilter())  
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createReviewDto: CreateReviewDto, @Req() req, @I18n() i18n: I18nContext) 
  {
    return this.reviewService.create({...createReviewDto, user: req.user.id}, i18n);
  }

  //Desc: Anyone can Get All Reviews of a product
  //Route: GET api/v1/review/:id
  //Access: Public
  @Get(':id')
  findAll(@Param('id') productId:string) 
  {
    return this.reviewService.findAll(productId);
  }

  //Desc: Admin can Get All Reviews of a specific user
  //Route: GET api/v1/review/user/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get('user/:id')
  findOne(@Param('id') id: string) 
  {
    return this.reviewService.findOne(id);
  }

  //Desc: user can Update his Review
  //Route: PATCH api/v1/review/:id
  //Access: Private (user only)
  @Roles(['user'])
  @Patch(':id')
  @UseFilters(new I18nValidationExceptionFilter())
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateReviewDto: UpdateReviewDto, @Req() req, @I18n() i18n: I18nContext) 
  {
    return this.reviewService.update(id, updateReviewDto, req, i18n);
  }

  //Desc: user can Delete his Review
  //Route: DELETE api/v1/review/:id
  //Access: Private (user only)
  @Roles(['user'])
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req, @I18n() i18n: I18nContext) 
  {
    return this.reviewService.remove(id, req, i18n);
  }
}