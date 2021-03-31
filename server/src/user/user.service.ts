import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Adress } from './adress/scheme/adress.entity';
import { User } from './scheme/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  // findAdress(id) {
  //   this.userRepository.findOne(id)
  //   .then(usr => {
  //     return this.adressRepository.findOne({ id : usr.adress})
  //   })
  // }

  async find(id : string) : Promise<User> {
    return this.userRepository.findOne(id)
  }

  create(user) : Promise<User> {
      return this.userRepository.save(user)  
  }

  remove(id : string) {
    return this.userRepository.delete(id)
  }

}
