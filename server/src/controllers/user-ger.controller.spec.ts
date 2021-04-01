import { Test, TestingModule } from '@nestjs/testing';
import { UserGerController } from './user-ger.controller';

describe('UserGerController', () => {
  let controller: UserGerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGerController],
    }).compile();

    controller = module.get<UserGerController>(UserGerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
