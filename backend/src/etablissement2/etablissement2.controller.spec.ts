import { Test, TestingModule } from '@nestjs/testing';
import { Etablissement2Controller } from './etablissement2.controller';
import { Etablissement2Service } from './etablissement2.service';

describe('Etablissement2Controller', () => {
  let controller: Etablissement2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Etablissement2Controller],
      providers: [Etablissement2Service],
    }).compile();

    controller = module.get<Etablissement2Controller>(Etablissement2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
