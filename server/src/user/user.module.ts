import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './scheme/user.entity';
import { UserService } from './user.service';
import { AdressModule } from './adress/adress.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AdressModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
