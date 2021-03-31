import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Connection } from 'typeorm'
// import { Product } from './user/user.entity';
// import { User } from './user/user.module';
import { UserModule } from './user/user.module';
import { User } from './user/scheme/user.entity';
import { Adress } from './user/adress/scheme/adress.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "dominuss",
    password: "123456",
    database: "company",
    entities: [User, Adress],
    synchronize: true
  }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor(private connection: Connection) {}
}
