import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';

import { User } from './scheme/user.entity';
import { UserService } from './user.service';
import * as logger from '../../config/logger';
import { UserChangeDto } from './userDto/user.update.dto';

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

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  modify(@Param('id') id: string, @Body() data: UserChangeDto) {
    try {
      return this.userService.change(id, data);
    } catch (e) {
      logger.error(`FROM / PUT ${id} -- ${e} STATUS 500`);
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
}
