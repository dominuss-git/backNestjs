import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

@Processor('ReqResUsers')
export class ReqUserAddProcessor {

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
    try {
      console.log(job)
    } catch (e) {

    }
  }
}
