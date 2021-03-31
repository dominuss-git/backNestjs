import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adress } from './scheme/adress.entity';

@Injectable()
export class AdressService {
  constructor(
    @InjectRepository(Adress)
    private adressRepository: Repository<Adress>
  ) {}

  findAll() : Promise<Adress[]> {
    return this.adressRepository.find()
  }

  find(id : string) : Promise<Adress> {
    return this.adressRepository.findOne(id)
  }

  create(adress: Adress, id: string) : Promise<Adress> {
    return this.adressRepository.save({ adress, id : id })
  }

  remove(userId : string, id : string) {
    return this.adressRepository.delete(id)
  }
}
