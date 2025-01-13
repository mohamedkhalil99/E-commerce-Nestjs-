import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { SignUpDto, SignInDto } from './dto/signup.dto';

@Controller('auth')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
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
}