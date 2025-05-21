import { Test, TestingModule } from '@nestjs/testing';
import { ContenuService } from './contenu.service';

describe('ContenuService', () => {
  let service: ContenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContenuService],
    }).compile();

    service = module.get<ContenuService>(ContenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
