import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
// import { Adress } from './scheme/adress.entity';
import { User } from './scheme/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {

  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() : Promise<User[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  find(@Param('id') id : string) :Promise<User> { 
    return this.userService.find(id)
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() user) {
    return this.userService.create(user)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
