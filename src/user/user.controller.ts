import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('user')
@UseGuards(AuthGuard)//Use the AuthGuard to protect the routes
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  //Desc: Admin can Create a new user
  //Route: POST api/v1/user
  //Access: Private (admin only)
  @Roles(['admin'])
  @Post()
  create(@Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) createUserDto: CreateUserDto) 
  {
    return this.userService.create(createUserDto);
  }

  //Desc: Admin can Get all users
  //Route: GET api/v1/user
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get()
  findAll(@Query() query: any)
  {
    return this.userService.findAll(query);
  }

  //Desc: Admin can Get a single user
  //Route: GET api/v1/user/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Get(':id')
  findOne(@Param('id') id: string) 
  {
    return this.userService.findOne(id);
  }

  //Desc: Admin can Update a user
  //Route: PATCH api/v1/user/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true})) updateUserDto: UpdateUserDto) 
  {
    return this.userService.update(id, updateUserDto);
  }

  //Desc: Admin can Delete a user
  //Route: DELETE api/v1/user/:id
  //Access: Private (admin only)
  @Roles(['admin'])
  @Delete(':id')
  remove(@Param('id') id: string) 
  {
    return this.userService.remove(id);
  }
}