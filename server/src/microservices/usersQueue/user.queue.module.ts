import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../../address/scheme/address.entity';
import { Department } from '../../department/scheme/department.entity';
import { Employee } from '../../employee/scheme/employee.entity';
import { User } from '../../user/scheme/user.entity';
import { DepartmentModule } from '../../department/department.module';
import { UserModule } from '../../user/user.module';
import { UserAddProcessor } from './user.queue.processor';
import { UserAddQueue } from './user.queue.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: "UsersQueue",
      useFactory: () => ({
        redis: {
          host: '127.0.0.1',
          port: 6379
        }
      })
    }),
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
    HttpModule,
    UserModule,
    DepartmentModule
  ],
  providers: [UserAddQueue, UserAddProcessor],
  exports: [UserAddQueue]
})
export class ReqUserAddModule {}
