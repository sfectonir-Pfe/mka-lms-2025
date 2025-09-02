import { Test, TestingModule } from '@nestjs/testing';
import { Etablissement2Service } from './etablissement2.service';

describe('Etablissement2Service', () => {
  let service: Etablissement2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Etablissement2Service],
    }).compile();

    service = module.get<Etablissement2Service>(Etablissement2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
