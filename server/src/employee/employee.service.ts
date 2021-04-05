import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './scheme/employee.entity';
import { EmployeeDto } from './employeeDto/employee.dto';

import * as logger from '../../config/logger';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  findAll(id: string): Promise<Employee[]> {
    return this.employeeRepository.find({ departmentId: id }).then((employee) => {
      if (!employee) {
        logger.error(`FROM department/:id/employee/ GET ALL -- STATUS ${HttpStatus.NOT_FOUND}`);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.NOT_FOUND,
        );
      } else {
        return employee;
      }
    });
  }

  find(userId: string, depId: string) {
    return this.employeeRepository.findOne({
      userId: userId,
      departmentId: depId,
    });
  }

  async create(data: EmployeeDto): Promise<Employee> {
    const employees = await this.employeeRepository.find({userId : data.userId})
    
    if (!employees[0]) {
      return this.employeeRepository.save(data).then((worker) => {
        if (!worker) {
          logger.error(
            `FROM department/:id/employee/ CREATE ${data.userId} -- STATUS 500`,
          );
          throw new HttpException(
            'Internal Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        } else {
          return worker;
        }
      });
    } else {
      throw new HttpException(`User is worked in another repository`, HttpStatus.BAD_REQUEST)
    }
  }

  remove(userId: string, departmentId: string) {
    return this.employeeRepository
      .delete({ userId: userId, departmentId: departmentId })
      .then((isDeleted) => {
        if (!isDeleted) {
          logger.error(`FROM employee DELETE -- STATUS 404`);
          throw new HttpException(
            'User not found',
            HttpStatus.NOT_FOUND,
          );
        } else if (isDeleted.affected === 0) {
          logger.error(
            `FROM employee DELETE  -- STATUS ${HttpStatus.NOT_FOUND}`,
          );
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        } else if (isDeleted.affected === 1) {
          return {
            message: 'Employee deleted',
            status: HttpStatus.OK,
          };
        }
      });
  }

  removeAll(departmentId: string) {
    return this.employeeRepository
      .delete({ departmentId: departmentId })
      .then((isDeleted) => {
        if (!isDeleted) {
          logger.error(`FROM employee DELETE -- STATUS 404`);
          throw new HttpException(
            "Department isn't delete",
            HttpStatus.NOT_FOUND,
          );
        } else if (isDeleted.affected === 0) {
          logger.error(
            `FROM employee DELETE  -- STATUS ${HttpStatus.NOT_FOUND}`,
          );
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        } else if (isDeleted.affected === 1) {
          return {
            message: 'Departament is deleted',
            status: HttpStatus.OK,
          };
        }
      });
  }
}
