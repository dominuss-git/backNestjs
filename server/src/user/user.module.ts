import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { User } from './scheme/user.entity';
import { UserService } from './user.service';
import { AddressModule } from '..//address/address.module';

const mockRepository = {
  id: 1,
  name: 'name',
  surname: 'surname',
  email: 'email',
  skils: 'skils',
  addressId: {
    id: 1,
    street: 'street',
    home: 1,
    flat: 1,
  },
};

@Module({
  imports: [TypeOrmModule.forFeature([User]), AddressModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: getRepositoryToken(User),
      useValue: mockRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
