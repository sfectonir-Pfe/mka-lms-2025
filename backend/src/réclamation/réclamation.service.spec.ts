import { Test, TestingModule } from '@nestjs/testing';
import { RéclamationService } from './réclamation.service';

describe('RéclamationService', () => {
  let service: RéclamationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RéclamationService],
    }).compile();

    service = module.get<RéclamationService>(RéclamationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
