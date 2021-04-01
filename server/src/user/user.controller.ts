import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { User } from './scheme/user.entity';
import { UserService } from './user.service';
import { UserDto } from './userDto/user.dto';
import * as logger from '../../config/logger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    try {
      return this.userService.findAll();
    } catch (e) {
      logger.error(`FROM / GET ALL -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  find(@Param('id') id: string): Promise<User> {
    try {
      return this.userService.find(id);
    } catch (e) {
      logger.error(`FROM /:id GET ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() user: UserDto) {
    try {
      return this.userService.create(user);
    } catch (e) {
      logger.error(`FROM /create POST ${user.email} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    try {
      return this.userService.remove(id);
    } catch (e) {
      logger.error(`FROM /:id DELETE ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
