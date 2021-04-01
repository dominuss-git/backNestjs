import { Controller } from '@nestjs/common';
import { DepartmentService } from './department.service';

// const logger = require('../../config/logger');

@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  // @Get()
  // @HttpCode(HttpStatus.OK)
  // findAll() : Promise<Department[]> {
  //   try {
  //     return this.departmentService.findAll()
  //   } catch (e) {
  //     logger.error(`FROM department/ GET ALL -- ${e} STATUS 500`)
  //     throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
  //   }
  // }

  // @Get('/:id')
  // @HttpCode(HttpStatus.OK)
  // find(@Param('id') id : string): Promise<Department> {
  //   try {
  //     return this.departmentService.find(id)
  //   } catch (e) {
  //     logger.error(`FROM department/ GET ${id} -- ${e} STATUS 500`)
  //     throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
  //   }
  // }

  // @Post('/create')
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() data : DepartmentDto) : Promise<Department>{
  //   try {
  //     return this.departmentService.create(data)
  //   } catch (e) {
  //     logger.error(`FROM department/create POST -- ${e} STATUS 500`)
  //     throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
  //   }
  // }
}
