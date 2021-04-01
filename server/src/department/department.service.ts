import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './scheme/department.entity';
import { DepDto } from './departmentDTO/department.dto';
import * as logger from '../../config/logger';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  findAll(): Promise<Department[]> {
    return this.departmentRepository.find().then((department) => {
      if (!department) {
        throw new HttpException(
          'Iternal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return department;
      }
    });
  }

  find(id: string): Promise<Department> {
    return this.departmentRepository.findOne(id).then((department) => {
      if (!department) {
        throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
      } else {
        return department;
      }
    });
  }

  create(data: DepDto): Promise<Department> {
    return this.departmentRepository.save(data).then((department) => {
      if (!department) {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return department;
      }
    });
  }

  remove(id: string) {
    return this.departmentRepository.delete(id).then((isDeleted) => {
      if (!isDeleted) {
        logger.error(`FROM departament/:id DELETE -- NOT FOUND STATUS 500`);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else if (isDeleted.affected === 0) {
        logger.error(
          `FROM departament/:id DELETE -- STATUS ${HttpStatus.NOT_FOUND}`,
        );
        throw new HttpException('Departament not found', HttpStatus.NOT_FOUND);
      } else if (isDeleted.affected === 1) {
        return {
          message: 'Department deleted',
          status: HttpStatus.OK,
        };
      }
    });
  }
}
