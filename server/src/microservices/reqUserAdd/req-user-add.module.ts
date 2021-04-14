import { BullModule } from '@nestjs/bull';
import { HttpModule, Module } from '@nestjs/common';
import { ReqUserAddService } from './req-user-add.service';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: "ReqResUsers",
      // useFactory: () => ({
      //   redis: {
      //     host: '127.0.0.1',
      //     port: 6379
      //   }
      // })
    }),
    HttpModule
  ],
  providers: [ReqUserAddService],
  exports: [ReqUserAddService]
})
export class ReqUserAddModule {}
