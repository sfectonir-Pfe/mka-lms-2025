import { Test, TestingModule } from '@nestjs/testing';
import { ProgramModuleService } from './program-module.service';

describe('ProgramModuleService', () => {
  let service: ProgramModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProgramModuleService],
    }).compile();

    service = module.get<ProgramModuleService>(ProgramModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
