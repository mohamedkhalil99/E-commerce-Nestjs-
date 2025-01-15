import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto, VerifyResetPasswordCodeDto, ForgotPasswordDto, NewPasswordDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController 
{
  constructor(private readonly authService: AuthService) {}

  //Desc: Anyone can sign up
  //Route: GET api/v1/auth/sign-up
  //Access: Public
  @Post('sign-up')
  signUp(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) signUpDto: SignUpDto) 
  {
    return this.authService.signUp(signUpDto);
  }

  //Desc: User can sign in
  //Route: GET api/v1/auth/sign-in
  //Access: Public
  @Post('sign-in')
  signIn(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) signInDto: SignInDto) 
  {
    return this.authService.signIn(signInDto);
  }

  //Reset password//
  //Desc: User can reset password
  //Route: POST api/v1/auth/forgot-password
  //Access: Public
  @Post('forgot-password')
  forgotPassword(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) email: ForgotPasswordDto)
  {
    return this.authService.forgotPassword(email);
  }

  //Desc: User can verify the reset password code
  //Route: POST api/v1/auth/verify-reset-password-code
  //Access: Public
  @Post('verify-reset-password-code')
  verifyResetPasswordCode(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) dto:VerifyResetPasswordCodeDto)
  {
    return this.authService.verifyResetPasswordCode(dto);
  }

  //Desc: User can Put a new password
  //Route: PUT api/v1/auth/reset-password
  //Access: Private (Admin, User)
  @Post('reset-password')//email:SignUpDto
  newPassword(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}))dto:NewPasswordDto )
  {
    return this.authService.newPassword(dto);
  }
}