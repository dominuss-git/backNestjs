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
import { DepartmentService } from './department.service';
import * as logger from '../../config/logger';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/scheme/employee.entity';

@Controller('department')
export class DepartmentController {
  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private userService: UserService,
  ) {}

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async modify(@Param('id') id: string, @Body() email): Promise<Employee> {
    try {
      const userId = await this.userService
        .findByEmail(email.email)
        .then((usr) => {
          if (!usr) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
          } else {
            return this.employeeService.find(usr.id, id).then((worker) => {
              if (worker) {
                throw new HttpException(
                  'User is worker on this department yet',
                  HttpStatus.BAD_REQUEST,
                );
              }
              return usr.id;
            });
          }
        });
      return this.employeeService.create({
        userId: userId,
        departmentId: id,
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
  async changeBoss(@Param('id') id: string, @Body() email) {
    try {
      const isChange = await this.userService
        .checkByEmail(email.email)
        .then((usr) => {
          if (!usr) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          } else {
            return this.employeeService.find(usr.id, id).then((worker) => {
              if (!worker) {
                throw new HttpException(
                  "User didn't work on this department",
                  HttpStatus.BAD_REQUEST,
                );
              }
              return this.departmentService.changeBoss(id, usr.id);
            });
          }
        });
      if (isChange.status === 200) {
        return isChange;
      } else {
        logger.error(`FROM departament/:id/change PUT ${id} -- STATUS 500`);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
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
  async find(@Param('id') id: string) {
    try {
      const data = await this.departmentService.find(id).then((dep) => {
        return this.employeeService.findAll(id).then((workers) => {
          return { workers, dep };
        });
      });
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
  async create(@Body() data) {
    try {
      const usr = await this.userService.findByEmail(data.bossEmail);
      if (!usr) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      const employee = await this.employeeService.findByUserId(data.bossEmail);

      if (!employee[0]) {
        const dep = await this.departmentService.create({
          name: data.name,
          type: data.type,
          bossId: usr.id,
        });

        if (!dep) {
          logger.error(
            `FROM departament/create POST dep -- STATUS ${HttpStatus.BAD_REQUEST}`,
          );
          throw new HttpException(
            'User is work in another department',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          return this.employeeService.create({
            userId: dep.bossId,
            departmentId: dep.id,
          });
        }
      } else {
        throw new HttpException(
          'User is work in another department',
          HttpStatus.BAD_REQUEST,
        );
      }
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
  async remove(@Param('id') id: string, @Body() userId) {
    try {
      const dep = await this.departmentService.find(id).then((dep) => {
        if (dep.bossId !== userId.userId) {
          throw new HttpException(
            'You must be boss on this department',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          return this.employeeService.removeAll(dep.id).then(() => {
            return dep;
          });
        }
      });

      return this.departmentService.remove(dep.id);
    } catch (e) {
      logger.error(`FROM departament/:id DELETE ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
