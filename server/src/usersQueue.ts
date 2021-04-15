import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ReqUserAddModule } from './microservices/usersQueue/user.queue.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ReqUserAddModule, {
    transport: Transport.REDIS,
    options: {
      url: 'redis://localhost:6379'
    } 
  });

  app.init()
}

bootstrap();