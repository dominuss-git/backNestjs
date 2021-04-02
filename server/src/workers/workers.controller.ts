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
import { Workers } from './scheme/workers.entity';
import { WorkersService } from './workers.service';
import { WorkersDto } from './workersDro/workers.dto';

import * as logger from '../../config/logger';

@Controller('/department/:dep/workers')
export class WorkersController {
  constructor(private workersService: WorkersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Param('dep') id: string): Promise<Workers[]> {
    try {
      return this.workersService.findAll(id);
    } catch (e) {
      logger.error(`FROM department/ GET ALL -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: WorkersDto): Promise<Workers> {
    try {
      return this.workersService.create(data);
    } catch (e) {
      logger.error(`FROM department/create POST -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Param('dep') depId: string) {
    try {
      return this.workersService.remove(id, depId);
    } catch (e) {
      logger.error(`FROM department/:id DELETE ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
