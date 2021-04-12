import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './scheme/department.entity';
import { DepartmentDto } from './departmentDto/department.dto';
import * as logger from '../../config/logger';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async findAll(): Promise<Department[]> {
    const department = await this.departmentRepository.find();
    if (!department) {
      logger.error(`FROM departament/ GET -- STATUS ${HttpStatus.NOT_FOUND}`);
      throw new HttpException('Departments not found', HttpStatus.NOT_FOUND);
    }
    return department;
  }

  async find(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne(id);
    if (!department) {
      logger.error(
        `FROM departament/:id GET -- STATUS ${HttpStatus.NOT_FOUND}`,
      );
      throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    }
    return department;
  }

  async create(data: DepartmentDto): Promise<Department> {
    const department = await this.departmentRepository.save(data);
    if (!department) {
      logger.error(`FROM departament/ POST -- STATUS ${HttpStatus.NOT_FOUND}`);
      throw new HttpException("Department is't create", HttpStatus.NOT_FOUND);
    }
    return department;
  }

  async lastUpdate(id: string) {
    return await this.departmentRepository.update(
      { id: id },
      {
        update: new Date(Date.now())
      },
    )
  }

  async changeBoss(id: string, bossId: string) {
    const isChange = await this.departmentRepository.update(
      { id: id },
      {
        bossId: bossId,
        update: new Date(Date.now())
      },
    );
    if (isChange.affected === 1) {
      return {
        message: 'Boss is change',
        status: HttpStatus.OK,
      };
    } else {
      logger.error(
        `FROM departament/:id PUT -- STATUS ${HttpStatus.NOT_FOUND}`,
      );
      throw new HttpException("Boss isn't changed", HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string) {
    const isDeleted = await this.departmentRepository.delete(id);
    if (isDeleted.affected === 0) {
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
  }
}
