import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { AddressService } from 'src/address/address.service';
import { User } from 'src/user/scheme/user.entity';
import { UserService } from 'src/user/user.service';
import { UserChangeDto } from 'src/user/userDto/user.update.dto';

import * as logger from '../../config/logger';

@Controller('user/:id')
export class UserGerController {
  constructor(
    private userService: UserService,
    private addressService: AddressService,
  ) {}

  @Get('/data')
  @HttpCode(HttpStatus.OK)
  getData(@Param('id') id: string): Promise<User> {
    try {
      return this.userService
        .find(id)
        .then((usr) => {
          if (!usr) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
          }
          return this.addressService
            .find(usr.addressId, usr.id)
            .then((address) => {
              if (!address) {
                logger.error(`FROM /registr POST ${usr.id} -- STATUS 500`);
                throw new HttpException(
                  'Internal Server Error',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                );
              }
              return { address, usr };
            });
        })
        .then((data) => {
          return {
            ...data.usr,
            ...data.address,
          };
        });
    } catch (e) {
      logger.error(`FROM user/:id/data GET -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/delete')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    try {
      return this.userService
        .find(id)
        .then((usr) => {
          return this.addressService.remove(id, usr.addressId);
        })
        .then(() => {
          return this.userService.remove(id);
        });
    } catch (e) {
      logger.error(`FROM user/:id/delete GET -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/modify')
  @HttpCode(HttpStatus.OK)
  modify(@Param('id') id: string, @Body() data: UserChangeDto) {
    try {
      return this.userService.change(id, data).then((id) => {
        return this.addressService.change(id, data);
      });
    } catch (e) {
      logger.error(`FROM user/:id/modify PUT -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
