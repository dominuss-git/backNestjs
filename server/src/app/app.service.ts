import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as config from 'config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { LoginDto } from './authDto/login.dto';
import { RegistrDto } from './authDto/registr.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AppService {
  constructor(private readonly userService: UserService) {}

  registr(data: RegistrDto) {
    return this.userService.create(data).then((usr) => {
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
