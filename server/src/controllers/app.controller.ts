import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AppService } from '../services/app.service';
import { LoginDto } from './authDto/login.dto';
import { RegistrDto } from './authDto/registr.dto';

import * as logger from '../../config/logger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() data: LoginDto) {
    try {
      return this.appService.login(data);
    } catch (e) {
      logger.error(`FROM /login POST ${data.email} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/registr')
  @HttpCode(HttpStatus.OK)
  registr(@Body() data: RegistrDto) {
    try {
      return this.appService.registr(data);
    } catch (e) {
      logger.error(`FROM /registr POST ${data.email} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
