import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
  ConfigModule.forRoot(),
  MongooseModule.forRoot('mongodb://0.0.0.0:27017/ecommerce'),
  UserModule,
  JwtModule.register({
    global: true,
    secret: process.env.JWTKey,
    signOptions: { expiresIn: '60s' },}),
  AuthModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}