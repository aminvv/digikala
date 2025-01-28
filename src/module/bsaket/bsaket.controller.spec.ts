import { Test, TestingModule } from '@nestjs/testing';
import { BsaketController } from './bsaket.controller';
import { BsaketService } from './bsaket.service';

describe('BsaketController', () => {
  let controller: BsaketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BsaketController],
      providers: [BsaketService],
    }).compile();

    controller = module.get<BsaketController>(BsaketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
