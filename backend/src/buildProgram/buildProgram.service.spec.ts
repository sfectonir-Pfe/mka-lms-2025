import { Test, TestingModule } from '@nestjs/testing';
import { buildProgramService } from './buildProgram.service';

describe('buildProgramService', () => {
  let service: buildProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [buildProgramService],
    }).compile();

    service = module.get<buildProgramService>(buildProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
