import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workers } from './scheme/workers.entity';
import { WorkersDto } from './workersDro/workers.dto';

import * as logger from '../../config/logger';

@Injectable()
export class WorkersService {
  constructor(
    @InjectRepository(Workers)
    private workersRepository: Repository<Workers>,
  ) {}

  findAll(id: string): Promise<Workers[]> {
    return this.workersRepository.find({ departmentId: id }).then((workers) => {
      if (!workers) {
        logger.error(`FROM department/:id/workers/ GET ALL -- STATUS 500`);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return workers;
      }
    });
  }

  create(data: WorkersDto): Promise<Workers> {
    return this.workersRepository.save(data).then((worker) => {
      if (!worker) {
        logger.error(
          `FROM department/:id/workers/ CREATE ${data.userId} -- STATUS 500`,
        );
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return worker;
      }
    });
  }

  remove(userId: string, departmentId: string) {
    return this.workersRepository
      .delete({ userId: userId, departmentId: departmentId })
      .then((isDeleted) => {
        if (!isDeleted) {
          logger.error(`FROM workers DELETE -- STATUS 500`);
          throw new HttpException(
            'Internal Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        } else if (isDeleted.affected === 0) {
          logger.error(
            `FROM workers DELETE  -- STATUS ${HttpStatus.NOT_FOUND}`,
          );
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        } else if (isDeleted.affected === 1) {
          return {
            message: 'Worker deleted',
            status: HttpStatus.OK,
          };
        }
      });
  }

  removeAll(departmentId: string) {
    return this.workersRepository
      .delete({ departmentId: departmentId })
      .then((isDeleted) => {
        if (!isDeleted) {
          logger.error(`FROM workers DELETE -- STATUS 500`);
          throw new HttpException(
            'Internal Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        } else if (isDeleted.affected === 0) {
          logger.error(
            `FROM workers DELETE  -- STATUS ${HttpStatus.NOT_FOUND}`,
          );
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        } else if (isDeleted.affected === 1) {
          return {
            message: 'Worker deleted',
            status: HttpStatus.OK,
          };
        }
      });
  }
}
