import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Department } from './scheme/department.entity';
import * as logger from '../../config/logger';

@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  find(@Param('id') id: string): Promise<Department> {
    try {
      return this.departmentService.find(id);
    } catch (e) {
      logger.error(`FROM department/ GET ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
