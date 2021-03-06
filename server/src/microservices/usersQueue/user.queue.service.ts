import { InjectQueue } from '@nestjs/bull';
import { HttpService, Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class UserAddQueue {
  constructor(
    @InjectQueue('UsersQueue')
    private UsersQueue: Queue,
    private readonly httpService: HttpService
  ) {}

  async userQueueAdd() {
    try {
      await this.UsersQueue.add(
        'userArray', 
        {users : (await this.httpService.get('https://reqres.in/api/users?page=2').toPromise()).data.data},
        {
          repeat : {
            cron: '* */1 * * *'
          }
        }
      )
      return true
    } catch(e) {
      console.log(e)
    }
  }
}
