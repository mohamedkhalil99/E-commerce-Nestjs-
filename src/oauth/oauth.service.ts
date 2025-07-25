import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';
import { CompleteProfileDto } from './dto/completeProfileDto';
import { I18nContext } from 'nestjs-i18n';

export function generatePassword(length: number = 12): string {
  if (length < 6 || length > 20) {
    throw new Error('Password length must be between 6 and 20 characters');
  }

  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?';
  const all = upper + lower + digits + symbols;

  const guarantee = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  //Complete the rest of the password with random characters
  const restLength = Math.max(length - guarantee.length, 0);
  const rest = Array.from({ length: restLength }, () => {
    return all[Math.floor(Math.random() * all.length)];
  });

  //Merge guaranteed characters with the rest
  const passwordArray = [...guarantee, ...rest].sort(() => Math.random() - 0.5); // shuffle
  return passwordArray.join('');
}

//bcrypt salt rounds
const saltRounds = 10;

@Injectable()
export class OauthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,private jwtService: JwtService){}
    
  async validateUser(profile: any, i18n: I18nContext): Promise<any> {
  // Check if user exists in the database
  const user = await this.userModel.findOne({ email: profile.emails[0].value });
  if (!user) {
    // If user does not exist, create a new user
    const password = await bcrypt.hash(generatePassword(), saltRounds);
    const tempNewUser = new this.userModel({
      email: profile.emails[0].value,
      name: profile.displayName,
      password,
      role: 'user',
      active: true,
      avatar: profile.photos[0] ? profile.photos[0].value : null,
      });

    return {status: 202, message: i18n.t('dto.PHONE_NUMBER_IS_REQUIRED') , tempUser: tempNewUser, requirePhoneNumber: true};
  }

  const payload={email: user.email, role: user.role, id: user._id};
  const token= await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET,});
  return {data: user, token};
}

  async completeProfile(completeProfileDto: CompleteProfileDto, i18n: I18nContext): Promise<any> {
    const { tempUser, phoneNumber } = completeProfileDto;

    const exists = await this.userModel.findOne({ email: tempUser.email });
    if (exists) {
      throw new ConflictException(i18n.t('service.ALREADY_EXISTS', {args:{property:i18n.t('service.USER')}} ));
    }
    if (!tempUser?.email || !phoneNumber) {
      throw new BadRequestException(i18n.t('service.MISSING_REQUIRED_FIELDS'));
    }

    const user = new this.userModel({ ...tempUser, phoneNumber });
    await user.save();

    const payload = { email: user.email, role: user.role, id: user._id };
    const token = await this.jwtService.signAsync(payload, {secret: process.env.JWT_SECRET});

    return {status: 201, message: i18n.t('service.CREATED_SUCCESSFULLY', {args:{property:i18n.t('service.USER')}}), data: user, token};
  }

}