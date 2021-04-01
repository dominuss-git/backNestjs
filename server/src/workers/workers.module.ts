import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workers } from './scheme/workers.entity';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workers])],
  controllers: [WorkersController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}
