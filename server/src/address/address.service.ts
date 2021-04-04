import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/scheme/user.entity';
import { AddressDto } from './addressDto/address.dto';
import { Address } from './scheme/address.entity';
import * as logger from '../../config/logger';
import { UserChangeDto } from 'src/user/userDto/user.update.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<Address[]> {
    return this.addressRepository.find().then((addr) => {
      if (!addr) {
        logger.error(`FROM address/ GET ${addr} -- NOT FOUND STATUS 500`);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return addr;
      }
    });
  }

  find(id: string, userId: string): Promise<Address> {
    return this.userRepository
      .findOne(userId)
      .then((usr) => {
        if (usr.addressId !== id) {
          logger.error(
            `FROM address/:id GET ${userId} -- unathorization access STATUS ${HttpStatus.UNAUTHORIZED}`,
          );
          throw new HttpException(
            'unathorization access',
            HttpStatus.UNAUTHORIZED,
          );
        } else {
          return usr;
        }
      })
      .then(() => {
        return this.addressRepository.findOne(id);
      });
  }

  create(address: AddressDto): Promise<Address> {
    return this.addressRepository.save(address).then((addr) => {
      if (!addr) {
        logger.error(`FROM address/create POST ${address} -- STATUS 500`);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return addr;
      }
    });
  }

  remove(userId: string, id: string) {
    return this.addressRepository.delete(id).then((isDeleted) => {
      if (!isDeleted) {
        logger.error(
          `FROM address/:id DELETE ${userId} -- NOT FOUND STATUS 500`,
        );
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else if (isDeleted.affected === 0) {
        logger.error(
          `FROM address/:id DELETE ${userId} -- STATUS ${HttpStatus.NOT_FOUND}`,
        );
        throw new HttpException('User address not found', HttpStatus.NOT_FOUND);
      } else if (isDeleted.affected === 1) {
        return {
          message: 'Address deleted',
          status: HttpStatus.OK,
        };
      }
    });
  }

  change(id: string, data: UserChangeDto) {
    return this.addressRepository
      .update(
        { id: id },
        {
          street: data.street,
          home: data.home,
          flat: data.flat,
        },
      )
      .then((isChange) => {
        if (isChange.affected === 1) {
          return {
            message: 'Data change',
            status: HttpStatus.OK,
          };
        } else {
          logger.error(`FROM address/:id PUT ${id} -- STATUS 500`);
          throw new HttpException(
            'Internal Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
  }
}
