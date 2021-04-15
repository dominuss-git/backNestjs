import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { DepartmentService } from "../../department/department.service";
import { UserService } from "../../user/user.service";

@Processor('UsersQueue')
export class UserAddProcessor {
  constructor(
    private readonly userService : UserService,
    private readonly departmentService: DepartmentService
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log('on active')
  }

  @OnQueueCompleted()
  onComplited(job: Job) {
    console.log('complited')
  }

  @OnQueueFailed()
  onError(job: Job<any>, error : any) {
    console.log(`error ${error}`)
  }

  @Process('userArray') 
  async userArray(job: Job<any>) {
    let dep = await this.departmentService.findAll()
    for (let val of job.data.users) {
      try {
        const user = await this.userService.create({
          name: val.first_name,
          surname: val.last_name,
          email: val.email,
          skils: 'nothing',
          home: 1,
          flat: 1,
          street: 'world',
          password: '123456',
          confirnPassword: '123456'
        })
        if (dep.length === 0) {
          dep.push(await this.departmentService.create({
            type: "type",
            name: "name",
            bossId: user.id
          }))
        }

        await this.departmentService.modify(dep[0].id, {email : user.email})

      } catch (e) {

      }
    }
  }
}
