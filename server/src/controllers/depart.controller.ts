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
import { DepartmentService } from 'src/department/department.service';
import { DepartamentDto } from 'src/controllers/depsDto/deps.dto';
import { UserService } from 'src/user/user.service';
import { WorkersService } from 'src/workers/workers.service';

import * as logger from '../../config/logger';

@Controller('departament')
export class DepartController {
  constructor(
    private departmentService: DepartmentService,
    private workersService: WorkersService,
    private userService: UserService,
  ) {}

  // @Get()
  // @HttpCode(HttpStatus.OK)
  // findAll() {
  //   return this.departmentService.findAll().then((deps) => {
  //     if (!deps) {
  //       throw new HttpException(
  //         'Internal Server Error',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     } else {
  //       const user = [];
  //       deps.map((val, i) => {
  //         this.workersService.findAll(val.id).then((workers) => {
  //           workers.map((value, j) => {
  //             this.userService.find(value.userId).then((usr) => {
  //               user.push(usr);
  //             });
  //           });
  //         });
  //       });
  //       return user;
  //     }
  //   });
  // }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: DepartamentDto) {
    try {
      return this.userService
        .findByEmail(data.bossEmail)
        .then((usr) => {
          if (!usr) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
          } else {
            return this.departmentService.create({
              name: data.name,
              type: data.type,
              bossId: usr.id,
            });
          }
        })
        .then((dep) => {
          if (!dep) {
            logger.error(`FROM departament/create POST dep -- STATUS 500`);
            throw new HttpException(
              'Internal Server Error',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          } else {
            return this.workersService.create({
              userId: dep.bossId,
              departmentId: dep.id,
            });
          }
        });
    } catch (e) {
      logger.error(
        `FROM departament/create POST ${data.bossEmail} -- ${e} STATUS 500`,
      );
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Body() userId: string) {
    try {
      return this.departmentService
        .find(id)
        .then((dep) => {
          if (dep.bossId !== userId) {
            throw new HttpException(
              'You must be boos on this department',
              HttpStatus.BAD_REQUEST,
            );
          } else {
            return this.workersService.removeAll(dep.id).then(() => {
              return dep;
            });
          }
        })
        .then((dep) => {
          return this.departmentService.remove(dep.id);
        });
    } catch (e) {
      logger.error(`FROM departament/:id DELETE ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
