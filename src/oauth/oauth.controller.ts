import { Body, Controller, Get, Post, Req, Res, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { AuthGuard } from '@nestjs/passport';
import { CompleteProfileDto } from './dto/completeProfileDto';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('oauth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  //Desc: Initiates Google OAuth login
  //Route: GET api/v1/oauth/sign-in/google
  //Access: Public  
  @Get('sign-in/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Initiates the Google OAuth login process
  }

  //Desc: Handles Google OAuth callback
  //Route: GET api/v1/oauth/google/callback
  //Access: Public
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res, @I18n() i18n: I18nContext) {    
    // await this.oauthService.validateUser(req.user.profile);
    const result = await this.oauthService.validateUser(req.user.profile, i18n);
    return res.json(result);
  }

  //Desc: Completes user profile after OAuth login
  //Route: POST api/v1/oauth/complete-profile
  //Access: Public
  @Post('complete-profile')
  @UseFilters(new I18nValidationExceptionFilter())
  async completeProfile(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) completeProfileDto: CompleteProfileDto, @I18n() i18n: I18nContext) {
  return this.oauthService.completeProfile(completeProfileDto, i18n);
  }
}