import { InjectQueue } from '@nestjs/bull';
import { HttpService, Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class ReqUserAddService {
  constructor(
    @InjectQueue('ReqResUsers')
    private reqUsersQueue: Queue,
    private readonly httpService: HttpService
  ) {}

  async reqUserAdd() {
    try {
      await this.reqUsersQueue.add(
        'userArray', 
        {users : await this.httpService.get('https://reqres.in/api/users?page=2')},
        {
          repeat : {
            cron: '*/1 * * * *'
          }
        }
      )
      return true
    } catch(e) {
      console.log(e)
    }
  }
}
