import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, UserProfileController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController,UserProfileController],
  providers: [UserService],
})
export class UserModule {}
