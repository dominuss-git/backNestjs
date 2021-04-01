import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { User } from './scheme/user.entity';
import { UserDto } from './userDto/user.dto';
import * as logger from '../../config/logger';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find().then((usr) => {
      if (!usr) {
        logger.error(`FROM / GET ${usr} --  STATUS 500`);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return usr;
      }
    });
  }

  find(id: string): Promise<User> {
    return this.userRepository.findOne(id).then((usr) => {
      if (!usr) {
        logger.error(`FROM /:id GET ${id} -- STATUS ${HttpStatus.NOT_FOUND}`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        return usr;
      }
    });
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email: email }).then((usr) => {
      if (!usr) {
        logger.error(
          `FROM /email GET ${email} -- STATUS ${HttpStatus.NOT_FOUND}`,
        );
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        return usr;
      }
    });
  }

  checkByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email: email }).then((usr) => {
      return usr;
    });
  }

  async create(user: UserDto): Promise<User> {
    user.password = await bcrypt.hash(user.password, 12);
    return this.userRepository.save(user).then((usr) => {
      if (!usr) {
        logger.error(`FROM /create POST ${user} -- STATUS 500`);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return usr;
      }
    });
  }

  // change(user : UserDto) {
  //   return this.userRepository.findOne({email: user.email })
  //   .then(usr => {
  //     if (!bcrypt.compare(usr.password, user.password)) {
  //       throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST)
  //     }

  //     return this.userRepository.update({id : usr.id}, {
  //       name: user.name,
  //       surname: user.surname,
  //       email : user.email,
  //       skils: user.skils
  //     })
  //   })
  //   .then(usr => {
  //     if (!usr) {
  //       throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
  //     } else {
  //       return usr
  //     }
  //   })
  // }

  remove(id: string) {
    return this.userRepository.delete(id).then((isDeleted) => {
      if (!isDeleted) {
        logger.error(`FROM /:id DELETE ${id} -- STATUS 500`);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else if (isDeleted.affected === 0) {
        logger.error(
          `FROM /:id DELETE ${id} -- STATUS ${HttpStatus.NOT_FOUND}`,
        );
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else if (isDeleted.affected === 1) {
        return {
          message: 'User deleted',
          status: HttpStatus.OK,
        };
      }
    });
  }
}
