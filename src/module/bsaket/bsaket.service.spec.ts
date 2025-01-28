import { Test, TestingModule } from '@nestjs/testing';
import { BsaketService } from './bsaket.service';

describe('BsaketService', () => {
  let service: BsaketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BsaketService],
    }).compile();

    service = module.get<BsaketService>(BsaketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
