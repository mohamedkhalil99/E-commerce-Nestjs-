import { Body, Controller, Post, UseFilters, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, VerifyResetPasswordCodeDto, ForgotPasswordDto, NewPasswordDto, RefreshTokenDto } from './dto/signup.dto';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('auth')
export class AuthController 
{
  constructor(private readonly authService: AuthService) {}

  //Desc: Anyone can sign up
  //Route: GET api/v1/auth/sign-up
  //Access: Public
  @Post('sign-up')
  @UseFilters(new I18nValidationExceptionFilter())
  signUp(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) signUpDto: SignUpDto, @I18n() i18n: I18nContext) 
  {
    return this.authService.signUp(signUpDto, i18n);
  }

  //Desc: User can sign in
  //Route: GET api/v1/auth/sign-in
  //Access: Public
  @Post('sign-in')
  @UseFilters(new I18nValidationExceptionFilter())
  signIn(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) signInDto: SignInDto, @I18n() i18n: I18nContext) 
  {
    return this.authService.signIn(signInDto, i18n);
  }

  //Reset password//
  //Desc: User can reset password
  //Route: POST api/v1/auth/forgot-password
  //Access: Public
  @Post('forgot-password')
  @UseFilters(new I18nValidationExceptionFilter())
  forgotPassword(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) emailDto: ForgotPasswordDto, @I18n() i18n: I18nContext)
  {
    return this.authService.forgotPassword(emailDto, i18n);
  }

  //Desc: User can verify the reset password code
  //Route: POST api/v1/auth/verify-reset-password-code
  //Access: Public
  @Post('verify-reset-password-code')
  @UseFilters(new I18nValidationExceptionFilter())
  verifyResetPasswordCode(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) dto:VerifyResetPasswordCodeDto, @I18n() i18n: I18nContext)
  {
    return this.authService.verifyResetPasswordCode(dto, i18n);
  }

  //Desc: User can Put a new password
  //Route: PUT api/v1/auth/reset-password
  //Access: Public
  @Post('reset-password')
  @UseFilters(new I18nValidationExceptionFilter())
  newPassword(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}))dto:NewPasswordDto, @I18n() i18n: I18nContext)
  {
    return this.authService.newPassword(dto, i18n);
  }

  //Desc: User can refresh access token
  //Route: POST api/v1/auth/refresh-token/:refreshToken
  //Access: Public
  @Post('refresh-token')
  @UseFilters(new I18nValidationExceptionFilter())
  refreshToken(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) dto: RefreshTokenDto, @I18n() i18n: I18nContext) {
    return this.authService.refreshToken(dto.refreshToken, i18n);
  }
}