import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ReviewModule } from './review/review.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { CloudinaryModule } from './upload-images/cloudinary.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';
import { ThrottlerModule } from '@nestjs/throttler';
import { OauthModule } from './oauth/oauth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    ConfigModule.forRoot({isGlobal: true,}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
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
    ReviewModule,
    CartModule,
    OrderModule,
    CloudinaryModule,
    OauthModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}