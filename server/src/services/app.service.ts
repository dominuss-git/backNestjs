import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as config from 'config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { LoginDto } from 'src/controllers/authDto/login.dto';
import { RegistrDto } from 'src/controllers/authDto/registr.dto';
import { AddressService } from 'src/address/address.service';
import { UserService } from 'src/user/user.service';
import * as logger from '../../config/logger';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  registr(data: RegistrDto) {
    return this.userService
      .checkByEmail(data.email)
      .then((usr) => {
        if (usr) {
          throw new HttpException('User is exist', HttpStatus.BAD_REQUEST);
        } else {
          return this.addressService.create({
            street: data.street,
            home: data.home,
            flat: data.flat,
          });
        }
      })
      .then((addr) => {
        if (!addr) {
          logger.error(`FROM /registr POST ${data.email} -- STATUS 500`);
          throw new HttpException(
            'Internal Server Error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        } else {
          return this.userService.create({
            email: data.email,
            name: data.name,
            surname: data.surname,
            skils: data.skils,
            password: data.password,
            addressId: addr.id,
          });
        }
      })
      .then((usr) => {
        const jwtToken = jwt.sign(
          {
            userId: usr.id,
          },
          config.get('jwtSecret'),
          {
            expiresIn: '1h',
          },
        );
        return { token: jwtToken, userId: usr.id };
      });
  }

  login(data: LoginDto) {
    return this.userService
      .findByEmail(data.email)
      .then((usr) => {
        return bcrypt.compare(data.password, usr.password).then((isMatch) => {
          return { usr, isMatch };
        });
      })
      .then((val) => {
        if (val.isMatch) {
          const jwtToken = jwt.sign(
            {
              userId: val.usr.id,
            },
            config.get('jwtSecret'),
            {
              expiresIn: '1h',
            },
          );
          return { token: jwtToken, userId: val.usr.id };
        } else {
          throw new HttpException('Wrong Password', HttpStatus.BAD_REQUEST);
        }
      });
  }
}
