import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Query, Req, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './decorators/roles.decorator';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller('user')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  //Desc: Admin can Create a new user
  //Route: POST api/v1/user
  //Access: Private (admin only)
  @Roles(['admin'])
  @Post()
  @UseFilters(new I18nValidationExceptionFilter())
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createUserDto: CreateUserDto, @I18n() i18n: I18nContext) 
  {
    return this.userService.create(createUserDto, i18n);
  }

  //Desc: Admin can Get all users
  //Route: GET api/v1/user
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get()
  findAll(@Query() query: any, @I18n() i18n: I18nContext)
  {
    return this.userService.findAll(query, i18n);
  }

  //Desc: Admin can Get a single user
  //Route: GET api/v1/user/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get(':id')
  findOne(@Param('id') id: string, @I18n() i18n: I18nContext) 
  {
    return this.userService.findOne(id, i18n);
  }

  //Desc: Admin can Update a user
  //Route: PATCH api/v1/user/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateUserDto: UpdateUserDto, @I18n() i18n: I18nContext) 
  {
    return this.userService.update(id, updateUserDto, i18n);
  }

  //Desc: Admin can Delete a user
  //Route: DELETE api/v1/user/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string, @I18n() i18n: I18nContext) 
  {
    return this.userService.remove(id, i18n);
  }
}

//User Profile Controller
@Controller('user-Profile')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class UserProfileController
{
  constructor(private readonly userService:UserService){}

  //For User
  //Desc: User can Get his/her profile
  //Route: GET api/v1/user-profile
  //Access: Private (admin and user)
  @Roles(['admin','user'])
  @Get()
  getProfile(@Req() req, @I18n() i18n: I18nContext)
  {
    return this.userService.getProfile(req.user, i18n);
  }

  //Desc: User can Update his/her profile
  //Route: PATCH api/v1/user-profile
  //Access: Private (admin and user)
  @Roles(['admin','user'])
  @Patch()
  updateProfile(@Req() req, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateUserDto: UpdateUserDto, @I18n() i18n: I18nContext)
  {
    return this.userService.update(req.user.id, updateUserDto, i18n);
  }

  //Desc: User can UnActive his/her profile
  //Route: DELETE api/v1/user-profile
  //Access: Private (user)
  @Roles(['user'])
  @Delete()
  unActiveProfile(@Req() req, @I18n() i18n: I18nContext)
  {
    return this.userService.unActiveProfile(req.user, i18n);
  }
}