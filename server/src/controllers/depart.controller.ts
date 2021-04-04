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
  Put,
} from '@nestjs/common';
import { DepartmentService } from 'src/department/department.service';
import { DepartmentDto } from 'src/controllers/depsDto/deps.dto';
import { UserService } from 'src/user/user.service';
import { WorkersService } from 'src/workers/workers.service';

import * as logger from '../../config/logger';
import { Workers } from 'src/workers/scheme/workers.entity';

@Controller('department')
export class DepartController {
  constructor(
    private departmentService: DepartmentService,
    private workersService: WorkersService,
    private userService: UserService,
  ) {}

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  modify(@Param('id') id: string, @Body() email): Promise<Workers> {
    try {
      return this.userService
        .findByEmail(email.email)
        .then((usr) => {
          if (!usr) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
          } else {
            return this.workersService.find(usr.id, id).then((worker) => {
              if (worker) {
                throw new HttpException(
                  'User is worker on this department yet',
                  HttpStatus.BAD_REQUEST,
                );
              }
              return usr.id;
            });
          }
        })
        .then((userId) => {
          return this.workersService.create({
            userId: userId,
            departmentId: id,
          });
        });
    } catch (e) {
      logger.error(`FROM departament/:id PUT ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id/change')
  @HttpCode(HttpStatus.OK)
  changeBoss(@Param('id') id: string, @Body() email) {
    try {
      return this.userService
        .checkByEmail(email.email)
        .then((usr) => {
          if (!usr) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          } else {
            return this.workersService.find(usr.id, id).then((worker) => {
              if (!worker) {
                throw new HttpException(
                  "User didn't work on this department",
                  HttpStatus.BAD_REQUEST,
                );
              }
              return this.departmentService.changeBoss(id, usr.id);
            });
          }
        })
        .then((isChange) => {
          if (isChange.status === 200) {
            return isChange;
          } else {
            logger.error(`FROM departament/:id/change PUT ${id} -- STATUS 500`);
            throw new HttpException(
              'Internal Server Error',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        });
    } catch (e) {
      logger.error(`FROM departament/:id/change PUT ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  find(@Param('id') id: string) {
    try {
      return this.departmentService
        .find(id)
        .then((dep) => {
          return this.workersService.findAll(id).then((workers) => {
            return { workers, dep };
          });
        })
        .then((data) => {
          const promices = [];

          for (const val of data.workers) {
            promices.push(this.userService.find(val.userId));
          }

          return Promise.all(promices).then((val) => {
            return {
              ...data.dep,
              users: val,
            };
          });
        });
    } catch (e) {
      logger.error(`FROM departament/:id GET ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  Get() {
    return this.departmentService.findAll().then((deps) => {
      const promises = [];
      for (const val of deps) {
        promises.push(this.find(val.id));
      }
      return Promise.all(promises);
    });
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: DepartmentDto) {
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
  remove(@Param('id') id: string, @Body() userId) {
    try {
      return this.departmentService
        .find(id)
        .then((dep) => {
          if (dep.bossId !== userId.userId) {
            throw new HttpException(
              'You must be boss on this department',
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
