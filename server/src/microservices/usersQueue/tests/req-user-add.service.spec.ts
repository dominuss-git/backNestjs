import { Test, TestingModule } from '@nestjs/testing';
import { ReqUserAddService } from '../user.queue.service';

describe('ReqUserAddService', () => {
  let service: ReqUserAddService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqUserAddService],
    }).compile();

    service = module.get<ReqUserAddService>(ReqUserAddService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
