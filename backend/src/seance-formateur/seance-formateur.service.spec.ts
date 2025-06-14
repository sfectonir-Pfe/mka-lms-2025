import { Test, TestingModule } from '@nestjs/testing';
import { SeanceFormateurService } from './seance-formateur.service';

describe('SeanceFormateurService', () => {
  let service: SeanceFormateurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeanceFormateurService],
    }).compile();

    service = module.get<SeanceFormateurService>(SeanceFormateurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
