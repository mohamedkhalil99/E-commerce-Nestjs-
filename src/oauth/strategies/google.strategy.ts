import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
	super({
	  clientID: process.env.GOOGLE_CLIENT_ID,
	  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	  callbackURL: process.env.GOOGLE_CALLBACK_URL,
	  scope: ['email', 'profile'],
	});
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = {
      accessToken,
      refreshToken,
      profile,
    }
    return user 
  }
}