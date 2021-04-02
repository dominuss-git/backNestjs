import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { User } from './scheme/user.entity';
import { UserDto } from './userDto/user.dto';
import * as logger from '../../config/logger';
import { UserChangeDto } from './userDto/user.update.dto';

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

  create(user: UserDto): Promise<User> {
    return bcrypt
      .hash(user.password, 12)
      .then((pswd) => {
        user.password = pswd;
        return this.userRepository.save(user);
      })
      .then((usr) => {
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

  change(id: string, data: UserChangeDto) {
    let addressId = null;
    return this.userRepository
      .findOne(id)
      .then(async (usr) => {
        addressId = usr.addressId;
        const isMatch = await bcrypt.compare(data.password, usr.password);
        if (!isMatch) {
          throw new HttpException(
            'Password is mismatch',
            HttpStatus.BAD_REQUEST,
          );
        } else if (usr.email !== data.email) {
          return this.checkByEmail(data.email);
        }
        return undefined;
      })
      .then((usr) => {
        if (usr) {
          throw new HttpException('Email busy', HttpStatus.BAD_REQUEST);
        }
        return this.userRepository
          .update(id, {
            name: data.name,
            surname: data.surname,
            email: data.email,
            skils: data.skils,
          })
          .then((isUpdated) => {
            return { ...isUpdated, id: addressId };
          });
      })
      .then((isUpdated) => {
        if (isUpdated.affected === 1) {
          return isUpdated.id;
        } else {
          throw new HttpException(
            'Interanl Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
  }
}
