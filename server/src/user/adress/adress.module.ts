import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdressController } from './adress.controller';
import { AdressService } from './adress.service';
import { Adress } from './scheme/adress.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Adress])],
  controllers: [AdressController],
  providers: [AdressService]
})
export class AdressModule {}
