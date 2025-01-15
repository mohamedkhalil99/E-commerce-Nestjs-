import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CategoryModule } from './category/category.module';
import { SubCategoryModule } from './sub-category/subCategory.module';

@Module({
  imports: [
  ConfigModule.forRoot(),
  MongooseModule.forRoot('mongodb://0.0.0.0:27017/ecommerce'),
  UserModule,
  JwtModule.register({
    global: true,
    secret: process.env.JWTKey,
    signOptions: { expiresIn: '300s' },}),
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
],
  controllers: [],
  providers: [],
})
export class AppModule {}