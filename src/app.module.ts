import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/subCategory.module';
import { BrandModule } from './brand/brand.module';
import { CouponModule } from './coupon/coupon.module';
import { SupplierModule } from './supplier/supplier.module';
import { ProductRequestModule } from './product-request/product-request.module';
import { TaxModule } from './tax/tax.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
  ConfigModule.forRoot(),
  MongooseModule.forRoot('mongodb://0.0.0.0:27017/ecommerce'),
  UserModule,
  JwtModule.register({
    global: true,
    secret: process.env.JWTKey,
    signOptions: { expiresIn: '300s' },
  }),
  AuthModule,
  MailerModule.forRoot({
    transport: {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },},
  }),
  CategoryModule,
  SubCategoryModule,
  BrandModule,
  CouponModule,
  SupplierModule,
  ProductRequestModule,
  TaxModule,
  ProductModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}