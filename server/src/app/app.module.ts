import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { User } from '../user/scheme/user.entity';
import { Address } from '../address/scheme/address.entity';
import { AddressModule } from '../address/address.module';
import { DepartmentModule } from '../department/department.module';
import { Department } from '../department/scheme/department.entity';
import { Employee } from '../employee/scheme/employee.entity';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dominuss',
      password: '123456',
      database: 'company',
      entities: [User, Address, Department, Employee],
      synchronize: true,
    }),
    UserModule,
    AddressModule,
    DepartmentModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}