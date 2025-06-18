import { Test, TestingModule } from '@nestjs/testing';
import { SeanceFormateurController } from './seance-formateur.controller';
import { SeanceFormateurService } from './seance-formateur.service';

describe('SeanceFormateurController', () => {
  let controller: SeanceFormateurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeanceFormateurController],
      providers: [SeanceFormateurService],
    }).compile();

    controller = module.get<SeanceFormateurController>(SeanceFormateurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
