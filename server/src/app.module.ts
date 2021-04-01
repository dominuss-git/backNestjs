import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { UserModule } from './user/user.module';
import { User } from './user/scheme/user.entity';
import { Address } from './address/scheme/address.entity';
import { AddressModule } from './address/address.module';
import { DepartmentModule } from './department/department.module';
import { Department } from './department/scheme/department.entity';
import { Workers } from './workers/scheme/workers.entity';
import { WorkersModule } from './workers/workers.module';
import { UserGerController } from './controllers/user-ger.controller';
import { DepartController } from './controllers/depart.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dominuss',
      password: '123456',
      database: 'company',
      entities: [User, Address, Department, Workers],
      synchronize: true,
    }),
    UserModule,
    AddressModule,
    DepartmentModule,
    WorkersModule,
  ],
  controllers: [AppController, UserGerController, DepartController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
