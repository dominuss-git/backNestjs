import { Test, TestingModule } from '@nestjs/testing';
import { DepartController } from './depart.controller';

describe('DepartController', () => {
  let controller: DepartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartController],
    }).compile();

    controller = module.get<DepartController>(DepartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
