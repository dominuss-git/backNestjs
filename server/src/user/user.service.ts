import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { User } from './scheme/user.entity';
import * as logger from '../../config/logger';
import { UserChangeDto } from './userDto/user.update.dto';
import { AddressService } from 'src/address/address.service';
import { RegistrDto } from 'src/app/authDto/registr.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private adressService :AddressService
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

  find(id: string) {
    return this.userRepository.findOne({where : {id : id} , relations : ['addressId'] })
    .then((usr) => {
      if (!usr) {
        logger.error(`FROM /:id GET ${id} -- STATUS ${HttpStatus.NOT_FOUND}`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        return {
          id : usr.id,
          email : usr.email,
          name: usr.name,
          surname: usr.surname,
          skils : usr.skils,
          addressId : usr.addressId.id,
          street : usr.addressId.flat,
          home : usr.addressId.home,
          flat : usr.addressId.flat
        };
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

  async create(user: RegistrDto) : Promise<User> {
    const usr = await this.checkByEmail(user.email)

    if (!!usr) {
      throw new HttpException('User is exist', HttpStatus.BAD_REQUEST)
    }
    const addr = await this.adressService.create({
      street : user.street,
      home : user.home,
      flat : user.flat
    })

    if (!addr) {
      throw new HttpException("User isn't create", HttpStatus.NOT_FOUND)
    }

    const hashedPassword = await bcrypt.hash(user.password, 12)
    
    return this.userRepository.save({
      email : user.email,
      password : hashedPassword,
      name : user.name,
      surname : user.surname,
      skils: user.skils,
      addressId : addr
    })
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

  async change(id: string, data: UserChangeDto) {
    const user = await this.userRepository
      .findOne(id)
      .then(async (usr) => {
        const isMatch = await bcrypt.compare(data.password, usr.password);
        if (!isMatch) {
          throw new HttpException(
            'Password is mismatch',
            HttpStatus.BAD_REQUEST,
          );
        } else if (usr.email !== data.email) {
          return this.checkByEmail(data.email)
          .then((usr) => {
            if (usr) {
              throw new HttpException('Email busy', HttpStatus.BAD_REQUEST);
            } else {
              return usr
            }
          })
        }
      })

      const isUpdated = await this.userRepository
        .update(id, {
          name: data.name,
          surname: data.surname,
          email: data.email,
          skils: data.skils,
          addressId : {
            street : data.street,
            home : data.home,
            flat : data.flat
          }
        })
        .then((isUpdated) => {
          return { ...isUpdated, id: user.addressId };
        });

        if (isUpdated.affected === 1) {
          return isUpdated.id;
        } else {
          throw new HttpException(
            'Interanl Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
  }
}
